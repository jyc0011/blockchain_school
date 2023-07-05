/* Ganache 및 IPFS와 연결 */
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
const ipfs = window.IpfsHttpClient.create("http://127.0.0.1:5001");

/* 컨트랙트 배포 후 컨트랙트 주소와 ABI 입력 */
const CA = "0x0CE6522A0aa0B9D5F06903a53a6377b394eB2Aae";
const ABI = [{
   "inputs": [
     {
       "internalType": "string",
       "name": "_name",
       "type": "string"
     },
     {
       "internalType": "string",
       "name": "_symbol",
       "type": "string"
     }
   ],
   "stateMutability": "nonpayable",
   "type": "constructor"
 },
 {
   "anonymous": false,
   "inputs": [
     {
       "indexed": true,
       "internalType": "address",
       "name": "_owner",
       "type": "address"
     },
     {
       "indexed": true,
       "internalType": "address",
       "name": "_approved",
       "type": "address"
     },
     {
       "indexed": true,
       "internalType": "uint256",
       "name": "_tokenId",
       "type": "uint256"
     }
   ],
   "name": "Approval",
   "type": "event"
 },
 {
   "anonymous": false,
   "inputs": [
     {
       "indexed": true,
       "internalType": "address",
       "name": "_owner",
       "type": "address"
     },
     {
       "indexed": true,
       "internalType": "address",
       "name": "_operator",
       "type": "address"
     },
     {
       "indexed": false,
       "internalType": "bool",
       "name": "_approved",
       "type": "bool"
     }
   ],
   "name": "ApprovalForAll",
   "type": "event"
 },
 {
   "anonymous": false,
   "inputs": [
     {
       "indexed": true,
       "internalType": "address",
       "name": "_from",
       "type": "address"
     },
     {
       "indexed": true,
       "internalType": "address",
       "name": "_to",
       "type": "address"
     },
     {
       "indexed": true,
       "internalType": "uint256",
       "name": "_tokenId",
       "type": "uint256"
     }
   ],
   "name": "Transfer",
   "type": "event"
 },
 {
   "inputs": [
     {
       "internalType": "uint256",
       "name": "",
       "type": "uint256"
     }
   ],
   "name": "images",
   "outputs": [
     {
       "internalType": "string",
       "name": "name",
       "type": "string"
     },
     {
       "internalType": "string",
       "name": "url",
       "type": "string"
     },
     {
       "internalType": "string",
       "name": "myAttributes",
       "type": "string"
     }
   ],
   "stateMutability": "view",
   "type": "function",
   "constant": true
 },
 {
   "inputs": [
     {
       "internalType": "uint256",
       "name": "",
       "type": "uint256"
     }
   ],
   "name": "isForSale",
   "outputs": [
     {
       "internalType": "bool",
       "name": "",
       "type": "bool"
     }
   ],
   "stateMutability": "view",
   "type": "function",
   "constant": true
 },
 {
   "inputs": [
     {
       "internalType": "address",
       "name": "",
       "type": "address"
     }
   ],
   "name": "tokenBalance",
   "outputs": [
     {
       "internalType": "uint256",
       "name": "",
       "type": "uint256"
     }
   ],
   "stateMutability": "view",
   "type": "function",
   "constant": true
 },
 {
   "inputs": [
     {
       "internalType": "uint256",
       "name": "",
       "type": "uint256"
     }
   ],
   "name": "tokenOwner",
   "outputs": [
     {
       "internalType": "address",
       "name": "",
       "type": "address"
     }
   ],
   "stateMutability": "view",
   "type": "function",
   "constant": true
 },
 {
   "inputs": [
     {
       "internalType": "uint256",
       "name": "",
       "type": "uint256"
     },
     {
       "internalType": "uint256",
       "name": "",
       "type": "uint256"
     }
   ],
   "name": "tokenOwnerHistory",
   "outputs": [
     {
       "internalType": "address",
       "name": "",
       "type": "address"
     }
   ],
   "stateMutability": "view",
   "type": "function",
   "constant": true
 },
 {
   "inputs": [
     {
       "internalType": "uint256",
       "name": "",
       "type": "uint256"
     }
   ],
   "name": "tokenPrice",
   "outputs": [
     {
       "internalType": "uint256",
       "name": "",
       "type": "uint256"
     }
   ],
   "stateMutability": "view",
   "type": "function",
   "constant": true
 },
 {
   "inputs": [
     {
       "internalType": "address",
       "name": "_to",
       "type": "address"
     },
     {
       "internalType": "string",
       "name": "_name",
       "type": "string"
     },
     {
       "internalType": "string",
       "name": "_url",
       "type": "string"
     },
     {
       "internalType": "string",
       "name": "myAttributes",
       "type": "string"
     }
   ],
   "name": "mint",
   "outputs": [],
   "stateMutability": "nonpayable",
   "type": "function"
 },
 {
   "inputs": [
     {
       "internalType": "uint256",
       "name": "tokenId",
       "type": "uint256"
     }
   ],
   "name": "ownerHistoryOf",
   "outputs": [
     {
       "internalType": "address[]",
       "name": "",
       "type": "address[]"
     }
   ],
   "stateMutability": "view",
   "type": "function",
   "constant": true
 },
 {
   "inputs": [
     {
       "internalType": "uint256",
       "name": "_tokenId",
       "type": "uint256"
     }
   ],
   "name": "ownerOf",
   "outputs": [
     {
       "internalType": "address",
       "name": "",
       "type": "address"
     }
   ],
   "stateMutability": "view",
   "type": "function",
   "constant": true
 },
 {
   "inputs": [
     {
       "internalType": "uint256",
       "name": "_tokenId",
       "type": "uint256"
     }
   ],
   "name": "sellToken",
   "outputs": [],
   "stateMutability": "nonpayable",
   "type": "function"
 },
 {
   "inputs": [
     {
       "internalType": "uint256",
       "name": "_tokenId",
       "type": "uint256"
     },
     {
       "internalType": "bool",
       "name": "_forSale",
       "type": "bool"
     }
   ],
   "name": "onSale",
   "outputs": [],
   "stateMutability": "nonpayable",
   "type": "function"
 },
 {
   "inputs": [
     {
       "internalType": "uint256",
       "name": "_tokenId",
       "type": "uint256"
     }
   ],
   "name": "isOnSale",
   "outputs": [
     {
       "internalType": "bool",
       "name": "",
       "type": "bool"
     }
   ],
   "stateMutability": "view",
   "type": "function",
   "constant": true
 },
 {
   "inputs": [
     {
       "internalType": "uint256",
       "name": "_tokenId",
       "type": "uint256"
     }
   ],
   "name": "buyToken",
   "outputs": [],
   "stateMutability": "payable",
   "type": "function",
   "payable": true
 },
 {
   "inputs": [
     {
       "internalType": "address",
       "name": "_from",
       "type": "address"
     },
     {
       "internalType": "address",
       "name": "_to",
       "type": "address"
     },
     {
       "internalType": "uint256",
       "name": "_tokenId",
       "type": "uint256"
     }
   ],
   "name": "transferFrom",
   "outputs": [],
   "stateMutability": "nonpayable",
   "type": "function"
 },
 {
   "inputs": [
     {
       "internalType": "address",
       "name": "_owner",
       "type": "address"
     }
   ],
   "name": "balanceOf",
   "outputs": [
     {
       "internalType": "uint256",
       "name": "",
       "type": "uint256"
     }
   ],
   "stateMutability": "view",
   "type": "function",
   "constant": true
 }
 ];
// ABI from build\contracts\myNFT.json
/* 컨트랙트 객체 생성 */
const contract = new web3.eth.Contract(ABI, CA);

let PK = '';
// private key get from user

// 지갑 가져오기
document.getElementById("wallet-import-btn").addEventListener('click', async () => {
   /* HTML 파일에서 입력받은 비밀키 가져오기 */
   PK = document.getElementById("pk").value;
   console.log(`Pk inputted: ${PK}`);
   /* 연결된 가나슈에서 비밀키로 계정 정보 가져오기 */
   const account = web3.eth.accounts.privateKeyToAccount(PK);
   let balance = await web3.eth.getBalance(account.address);
   let nftBalance = await contract.methods.balanceOf(account.address).call();

   /* HTML에 받아온 정보 표시 */
   document.getElementById('wallet-address').innerText = account.address;
   document.getElementById('eth_balance').innerText = web3.utils.fromWei(balance, 'ether');
   document.getElementById('nft_balance').innerText = nftBalance;
   
   console.log("wallet import with private key");
});

// NFT 생성 기능
document.getElementById("nft-gen-btn").addEventListener('click', async () => {
   
   /* 위에서 받아온 계정으로 NFT 발행 */
   const account = web3.eth.accounts.privateKeyToAccount(PK);
   /* HTML에서 입력한 이름과 파일, 속성 정보 가져오기 */
   const name = document.getElementById("nft-name").value;
   const nftAttribute1 = document.querySelector('#nft-myAttribute-1').value;

   /* 입력한 속성값을 메타데이터로 저장 */
   const nftMetadata = {
      nftAttribute1: nftAttribute1
   }

   /* IPFS 노드 상에 NFT 업로드 및 url 지정 */
   const file = document.getElementById("nft-file").files[0];
   const result = await ipfs.add(file);
   nftMetadata.url = `http://localhost:5001/webui/#/explore/${result.path}`;
   const metadataResult = await ipfs.add(JSON.stringify(nftMetadata));
   
   console.log(`Image CID: ${result.path}`);
   console.log(`Metadata CID: ${metadataResult.path}`);
   console.log(`Image Metadata: \n
      mintingAddress : ${account.address} \n ipfsPath : ${result.path} \n
      name : ${name} \n nftAttribute1 : ${nftAttribute1}`);

   
   const bytedata = await contract.methods.mint
      (account.address, name, result.path, nftAttribute1).encodeABI();
   // account.address, 즉 "wallet-import-btn"에서 개인키를 기반으로 불러온 주소로 발행

   const tx = {
      from: account.address,
      to: CA,
      gas: 1000000,
      gasPrice: '21000000000',
      data: bytedata
   };

   const signedTx = await account.signTransaction(tx);
   const sentTx = await web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
   alert("NFT 생성 완료");
   console.log("NFT minted");
});

// 이미지 조회 기능
function displayImage(imageUrl) {
   const imageContainer = document.getElementById('image-container');
   const imgElement = document.createElement('img');
   imgElement.src = imageUrl;
   imgElement.width = 300;
   imgElement.height = 300;
   imageContainer.innerHTML = '';
   imageContainer.appendChild(imgElement);
}

// NFT 조회 기능
document.getElementById("nft-search-btn").addEventListener('click', async () => {
   const tokenId = document.getElementById("nft-tokenId").value;
   const address = await contract.methods.ownerOf(tokenId).call();
   const {name, url, nftAttribute1} = await contract.methods.images(tokenId).call();
   const nftOwnerHistory = await contract.methods.ownerHistoryOf(tokenId).call();

   console.log(`Token Id to search: ${tokenId} \n Token's owner address found: ${address}
      \n Token name found: ${name} \n Token url found: ${url} \n 
      Token's attributes found: nftAttribute1 : ${nftAttribute1}`);

   const imageUrl = `https://ipfs.io/ipfs/${url}`;
   displayImage(imageUrl);

   document.getElementById('nft-owner-address-search').innerText = address;
   document.getElementById('nft-name-search').innerText = name;
   document.getElementById('ipfs-path-search').innerHTML =
      `<a href="http://localhost:5001/webui/#/explore/${url}" target="_blank">${url}`;
   document.getElementById('nft-attributes').innerText = `nftAttribute1 : ${nftAttribute1}`;
   document.getElementById('nft-owner-history').innerText = nftOwnerHistory.join(' -> ');

   console.log("Token found successfully");
});

// NFT 판매 시작
document.getElementById("nft-onSale-btn").addEventListener('click', async () => {
   /* HTML로 입력받은 토큰Id의 소유자 주소, 함수의 호출자를 가져옴 */
   const tokenIdToSell = document.getElementById('tokenId-onSale').value;
   const address = await contract.methods.ownerOf(tokenIdToSell).call();
   const account = web3.eth.accounts.privateKeyToAccount(PK);
   console.log(`Token Id to sell: ${tokenIdToSell}`);
   console.log(`Owner of token Id to sell: ${address}`);

   try{
      const bytedata = await contract.methods.sellToken(tokenIdToSell).encodeABI();
      // sellToken 함수 불러와 실행
      const tx = {
         from: account.address,
         to: CA,
         gas: 1000000,
         gasPrice: '21000000000',
         data: bytedata
      };
   
      const signedTx = await account.signTransaction(tx);
      const sentTx = await web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
      alert("NFT 판매 시작");
   
      console.log("NFT is now successfully on sale");
   } catch (error) {
      if (error.message.includes("Only owner can sell token")) {
         alert("Only owner can sell token");
         console.log("Owner not checked");
      }
   }
});

// NFT 구매 시작
document.getElementById("nft-buy-btn").addEventListener('click', async () => {
   const tokenIdToBuy = document.getElementById('tokenId-to-buy').value;
   const etherValueToBuy = document.getElementById('value-to-buy').value;
   const valueInWei = web3.utils.toWei(etherValueToBuy, 'ether');
   // 전송하고자 하는 이더량과 토큰ID 받아오기
   const account = web3.eth.accounts.privateKeyToAccount(PK);
   // 개인키로 정보를 받아온 주소 가져오기 (이는 곧 구매자의 계좌가 됨)
   console.log(`Buyer Address: ${account.address},
      Token ID to buy: ${tokenIdToBuy}, Payed value in wei: ${valueInWei}`);
   

   try {
      const bytedata = contract.methods.buyToken(tokenIdToBuy).encodeABI();
         
      // buyToken의 경우 msg.sender가 구매자여야 함
      let rawTransaction = {
         'from': account.address,
         'gasPrice': web3.utils.toHex(20 * 1e9), // 20 Gwei
         'gasLimit': web3.utils.toHex(210000),
         'to': contract._address,
         'value': web3.utils.toHex(valueInWei),
         'data': bytedata,
      }
      // raw transaction 생성
      // 다른 트랜잭션과 달리 value 란을 추가하여 전송

      let signedTransaction = await web3.eth.accounts.signTransaction(rawTransaction, account.privateKey);
      let transactionReceipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
      alert("NFT 구매");
      console.log("NFT buy successed");
   } catch (error) {
      if (error.message.includes("Validation failed: Token is not on sale")) {
         alert("Validation failed: Token is not on sale");
         console.log("Token is not on sale");
      } else if (error.message.includes("Validation failed: Not enough ETH")) {
         alert("Not enough ETH");
         console.log("Not enough ETH");
      } else if (error.message.includes("Validation failed: You cannot buy your own token")) {
         alert("Validation failed: You cannot buy your own token");
         console.log("You cannot buy your own token")
      }
   }
   
})