from flask import Flask, request, jsonify, render_template, send_from_directory

from blockchain import Blockchain
from uuid import uuid4
import requests
import sys

app = Flask(__name__)
bitcoin = Blockchain()

node_address = str(uuid4()).replace('-', '')


@app.route('/blockchain', methods=['GET']) #전체 블록을 보여줌
def get_blockchain():
    return jsonify(bitcoin.__dict__)


@app.route('/transaction', methods=['POST']) # pending_transactions에 transaction 추가
def create_transaction():
    new_transaction = request.get_json()
    block_index = bitcoin.add_transaction_to_pending_transactions(new_transaction)
    return jsonify({'note': f'Transaction will be added in block {block_index}.'})



@app.route('/mine', methods=['GET']) # 작업증명
def mine():
    last_block = bitcoin.get_last_block()
    # 가장 마지막에 채굴된 블록 검색
    # self.chain[len(self.chain) - 1]
    # 방식은 자신의 체인 길이를 재고
    # 길이에서 -1 한 값을 인덱스로 하여 체인에서 찾아냄
    previous_block_hash = last_block['hash']
    # 앞에서 찾아낸 블록에서 해시를 추출함
    # 이 해시값은 이번에 만드는 새 블록의 이전 해시 값이 됨
    # 이를 통해 체인의 무결성 유지
    current_block_data = { #이번 블록에 즐어갈 데이터
        'transactions': bitcoin.pending_transactions,
        # 현재 보류중인 트랜잭션들을 모두 채굴
        'index': last_block['index'] + 1
        # 마지막 블록의 인덱스보다 그 값을 1 늘림
    }
    bitcoin.create_new_transaction(12.5, "00", node_address)
    # 새 트랜잭션을 하나 생성
    # 이 트랜잭션은 보내는 사람이 없다는 의미에서 "80"으로 지정되어있음
    # 이 트랜잭션은 채굴 보상 역할을 하고, 채굴자 (node_address)가 12.5의 보상을 받음
    nonce = bitcoin.proof_of_work(previous_block_hash, current_block_data)
    # nonce값을 찾기 위한 pow(작업 증명) 수행
    block_hash = bitcoin.hash_block(previous_block_hash, current_block_data, nonce)
    # 새로 생성할 블럭의 해시값 계산
    new_block = bitcoin.create_new_block(nonce, previous_block_hash, block_hash)
    # 위에서 계산한 해시값과 nonce, 이전 블록 해시값을 이용해 새 블록 생성
    request_promises = []

    for network_node_url in bitcoin.network_nodes:
        # 현재 네트워크에 참여하고 있는 노드에 대한 목록을 순회하면서 (즉, broadcast)
        request_options = {# 전송할 내용
            'newBlock': new_block
        }
        res = requests.post(network_node_url + '/receive-new-block', json=request_options)
        # 각노드의 /receive-new-block 엔드포인트에게 POST로 전송할 것을 요청
        # 관련 데이터는 json으로 보냄
        request_promises.append(res)
        # POST 요청에 대한 응답(HTTP 응답)을 목록에 추가해둠
        if res.status_code != 200:
            # POST 요청이 성공했는지 확인
            # 응답이 2000이 아니면 오류임
            print(f"Broadcast failed to {network_node_url}")
            # 오류가 발생한 노드의 Url(ip주소+포트엔드포인트)를 출력

    responses = [rp.json() for rp in request_promises]
    # 노드의 응답을 json으로 변환
    # 위에서 받은 응답, res는 HTTP 응답이기 때문에 변환이 필요
    request_options = {
        'amount': 12.5,
        'sender': "00",
        'recipient': node_address
    }
    requests.post(bitcoin.current_node_url + '/transaction/broadcast', json=request_options)
    # 네트워크에 참여하고 있는 모든 노드들에게 채굴보상에 관한 트랜잭션을 broadcast
    return jsonify({# 새 블록이 잘 채굴되었다는 json 응답을 miner에게 반환
        'note': "New block mined successfully",
        'block': new_block
    })

@app.route('/register-and-broadcast-node', methods=['POST'])
def register_and_broadcast_node():
    # 네트워크에 새 노드를 추가하고, 기존 노드들도 이 사실을 알게하는 함수
    # 더불어 새 노드에게도 이 사실에 대하여 전송
    new_node_url = request.json['newNodeUrl']
    # POST 요정 수신하여 json 안에서 새 노드의 url 추출
    if new_node_url not in bitcoin.network_nodes:
        # 만약 이 노드가 기존의 네트워크에 포함된 게 아니라면
        bitcoin.network_nodes.append(new_node_url)
        # 네트워크에 포함된 노드 목록에 새롭게 추가
    reg_nodes_promises = []
    # broadcast때 노드들이 보내주는 응답 저장
    for network_node_url in bitcoin.network_nodes:
        # 네트워크에 들어있는 노드들을 순회하면서(broadcast)
        response = requests.post(f"{network_node_url}/register-node", json={'newNodeUrl': new_node_url})
        # 새로운 노드를 연결하는 요청 받은 노드가
        # 원래 연결되어 있던 노드에게 새로운 노드를 등록하는 요청 보내는 API 호출
        # 기존 노드 주소/register-node 엔드포인트에 POST로 요청을 보냄
        reg_nodes_promises.append(response)
        # 목록에 응답(HTTP) 추가

    for response in reg_nodes_promises:
        # 저장된 모든 응답에 대해 순회하면서
        if response.status_code == 200:
            # 정상적으로 요청이 잘 되었으면 (200)
            requests.post(f"{new_node_url}/register-nodes-bulk", json={'allNetworkNodes': bitcoin.network_nodes + [bitcoin.current_node_url]}) # 새로운 노드를 추가한 뒤 전체 노드 정보를 새로 연결되는 노드에게 주는 API 호출
            # 새로운 노드를 추가한 뒤 전체 노드 정보를 새로 연결되는 노드에게 주는 API 호출
    return jsonify({'note': 'New node registered with network successfully.'})
    # 성공메세지와 함께 json 응답을 return

@app.route('/register-node', methods=['POST'])
def register_node():
    # 기존에 네트워크에 참여한 노드들에게 새 노드의 네트워크 참여를 알려주는 API
    new_node_url = request.json['newNodeUrl']
    # POST 요청을 수신하여 json 안에서 새 노드의 Url 추출
    node_not_already_present = new_node_url not in bitcoin.network_nodes
    # 새롭게 추가될 노드가 이미 네트워크에 참여하고 있는지, 아닌지 확인
    not_current_node = bitcoin.current_node_url != new_node_url
    # 또한 현재 나의 노드와 같은 Ur1은 아닌지 확인해줌
    if node_not_already_present and not_current_node:
        # 이미 네트워크에 참여한 노드가 아니고, 나의 노드와 동일하지 않다면 
        bitcoin.network_nodes.append(new_node_url)
        # 네트워크에 새로 참가 시킴 (네트워크 노드 목록에 추가)
    return jsonify({'note': 'New node registered successfully.'})
    # 성공메세지와 함께 json 응답을 return


@app.route('/register-nodes-bulk', methods=['POST'])
def register_nodes_bulk():
    # 새로운 노드를 추가한 뒤 전체 노드 정보를 새로 연결되는 노드에게 전송하고
    # 새롭게 참여하는 노드가 이 정보를 저장
    all_network_nodes = request.json['allNetworkNodes']
    # POST 요청을 수신하여 json 안에서 기존 노드의 Url 추출
    for network_node_url in all_network_nodes:
        # 기존 노드들에 대해 검사
        node_not_already_present = network_node_url not in bitcoin.network_nodes
        # 이미 네트워크에 참여하고 있는지, 아닌지 확인
        not_current_node = bitcoin.current_node_url != network_node_url
        # 또한 현재 나의 노드와 같은 Ur1은 아닌지 확인해줌
        if node_not_already_present and not_current_node:
            # 두가지 다 만족하면
            bitcoin.network_nodes.append(network_node_url)
            # 네트워크 목록에 추가
    return jsonify({'note': 'Bulk registration successful.'})
    # 성공메세지와 함께 json 응답을 return



@app.route('/transaction/broadcast', methods=['POST'])
def broadcast_transaction():
    # 네트워크에 참여중인 다른 노드에게 새 트랜잭션을 broadcast
    new_transaction = bitcoin.create_new_transaction(
        # 받은 요청으로 새 트랜잭션 생성
        request.json['amount'],
        request.json['sender'],
        request.json['recipient']
    )
    bitcoin.add_transaction_to_pending_transactions(new_transaction)
    # 현재 보류 중인 트랜잭션 목록이 새 트랜잭션을 추가
    request_promises = []
    # broadcast했을 때 노드들이 보내주는 응답 저장
    for network_node_url in bitcoin.network_nodes:
        #네트워크 목록을 순회하면서(broadcast)
        request_options = {
            # 요청을 보낼 주소와 내용
            'url': network_node_url + '/transaction',
            'json': new_transaction
        }
        request_promises.append(requests.post(**request_options))
        # 위에서 해둔 내용을 POST 요청으로 전송
        # 이에 대한 응답을 목록에 추가
    for response in request_promises:
        # 받은 모든 응답들에 대해
        response.raise_for_status()
        # 정상적으로 요청이 잘 되었다는 응답인지 확인(200)
        # 200이 아니면 에러 발생
    return jsonify({'note': 'Transaction created and broadcast successfully.'})
    # 성공 메세지와 함께 json 응답을 return
    
@app.route('/receive-new-block', methods=['POST'])
def receive_new_block():
    new_block = request.json['newBlock']
    last_block = bitcoin.get_last_block()
    correct_hash = last_block['hash'] == new_block['previous_block_hash']
    correct_index = last_block['index'] + 1 == new_block['index']

    if correct_hash and correct_index:
        bitcoin.chain.append(new_block)
        bitcoin.pending_transactions = []
        return jsonify({
            'note': 'New block received and accepted',
            'newBlock': new_block
        })
    else:
        return jsonify({
            'note': 'New block rejected.',
            'newBlock': new_block
        })


if __name__ == "__main__":
    if len(sys.argv) > 1:
        port = int(sys.argv[1])
    else:
        port = 5000  # 기본 포트 번호를 설정하십시오.
    
    if len(sys.argv) > 2:
        current_node_url = sys.argv[2]
    else:
        current_node_url = f"http://localhost:{port}"
    
    bitcoin = Blockchain(current_node_url)  # 현재 노드 URL 전달
    app.run(host="0.0.0.0", port=port)