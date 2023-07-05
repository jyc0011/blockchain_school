from flask import Flask, request, jsonify
from uuid import uuid4
import sys

from blockchain import Blockchain

app = Flask(__name__)
bitcoin = Blockchain()

node_address = str(uuid4()).replace('-', '')

@app.route('/blockchain', methods=['GET'])
def get_blockchain():
    response = {
        'chain': bitcoin.chain,
        'length': len(bitcoin.chain)
    }
    return jsonify(response)


@app.route('/transaction', methods=['POST'])
def create_transaction():
    new_transaction = request.get_json()
    block_index = bitcoin.create_new_transaction(
        new_transaction['amount'], 
        new_transaction['sender'], 
        new_transaction['recipient']
    )
    return jsonify({'note':f'Transaction will be added in block {block_index}.'})

@app.route('/mine', methods=['GET'])
def mine():
    last_block = bitcoin.get_last_block
    previous_block_hash = last_block['hash']
    current_block_data = {
        'transactions': bitcoin.pending_transactions,
        'index': last_block['index'] + 1
    }
    bitcoin.create_new_transaction(12.5, "00", node_address)
    nonce = bitcoin.proof_of_work(previous_block_hash, current_block_data)
    block_hash = Blockchain.hash_block(previous_block_hash, current_block_data, nonce)
    new_block = bitcoin.create_new_block(nonce, previous_block_hash, block_hash)
    response = {
        'note': "New block mined successfully",
        'block': new_block 
    }
    return jsonify(response)


if __name__ == '__main__':
    if len(sys.argv) > 1:
        port = int(sys.argv[1])
    else:
        port = 5000 # Set default port number.
    
    if len(sys.argv) > 2:
        current_node_url = sys.argv[2]
    else:
        current_node_url = "http://localhost:{port}"

    bitcoin = Blockchain(current_node_url)
    app.run(host='0.0.0.0', port=port)
