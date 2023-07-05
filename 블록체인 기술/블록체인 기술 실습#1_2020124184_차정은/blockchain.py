import time
import hashlib
import json
from uuid import uuid4

class Blockchain:
    def __init__(self, current_node_url=None):
        self.chain = []
        self.pending_transactions = []
        self.create_new_block(50, '0', '0') # Genesis block

    def create_new_block(self, nonce, previous_block_hash, hash_):
        new_block = {
            'index': len(self.chain),
            'timestamp': time.time(),
            'transactions': self.pending_transactions,
            'nonce': nonce,
            'hash': self.hash_block(previous_block_hash, self.pending_transactions, nonce),
            'previous_block_hash': previous_block_hash
        }
        self.pending_transactions = []
        self.chain.append(new_block)
        return new_block
    
    @property
    def get_last_block(self):
        return self.chain[-1]
    
    def create_new_transaction(self, amount, sender, recipient):
        new_transaction = {
            'amount': amount,
            'sender': sender,
            'recipient': recipient
        }
        self.pending_transactions.append(new_transaction)
        return self.get_last_block['index'] + 1

    @staticmethod
    def hash_block(previous_block_hash, current_block_data, nonce):
        data_as_string = json.dumps(current_block_data, sort_keys=True) + str(nonce) + previous_block_hash
        hash_object = hashlib.sha256(data_as_string.encode())
        hash_ = hash_object.hexdigest()
        return hash_
    
    def proof_of_work(self, previous_block_hash, current_block_data):
        nonce = 0
        hash_ = self.hash_block(previous_block_hash, current_block_data, nonce)
        while hash_[:4] != '0000':
            nonce += 1
            hash_ = self.hash_block(previous_block_hash, current_block_data, nonce)
        return nonce
    
    def add_transaction_to_pending_transactions(self, transaction_obj):
        self.pending_transactions.append(transaction_obj)
        return self.get_last_block['index'] + 1
