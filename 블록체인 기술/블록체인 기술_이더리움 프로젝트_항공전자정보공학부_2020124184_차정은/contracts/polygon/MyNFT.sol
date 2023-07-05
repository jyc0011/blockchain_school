// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
// 컴파일에 필요한 solidity 버전

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// openzeppelin의 ERC721, Ownable, Counters, ERC721URIStorage 라이브러리 이용

contract MyNFT is ERC721, Ownable, ERC721URIStorage {
// 스마트 컨트랙트를 정의
// ERC721 (NFT 표준), Ownable (소유권 관리), ERC721URIStorage (NFT 메타데이터 저장) 상속
    using Counters for Counters.Counter;
    //  Counters 라이브러리를 Counters.Counter로 사용
    Counters.Counter private _tokenIds;
    // token의 id를 저장할 변수 선언
    struct Item { // token 구조체
        uint256 id;
        address owner;
        uint256 price;
    }
    mapping (uint256 => Item) private _items;
    // id에 item 매핑
    constructor() ERC721("MyNFT", "MNFT") {}
    // contract의 이름과 symbol 결정
    function _burn(uint256 tokenId) internal virtual override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    } // 상속 받은 함수를 재정의

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721URIStorage) returns (bool) {
        // 주어진 interface를 사용하는지 확인
        return super.supportsInterface(interfaceId);
    } // 상속 받은 함수를 재정의

    function tokenURI(uint256 tokenId) public view virtual override(ERC721, ERC721URIStorage) returns (string memory) {
        // 주어진 토큰 ID에 연결된 메타데이터 URI를 반환
        return super.tokenURI(tokenId);
    }  // 상속 받은 함수를 재정의
    
    function mintNFT(address recipient, string memory tokenUriParam, uint256 price) public onlyOwner returns (uint256) {
    // 새로운 NFT 토큰을 발행하고, 해당 토큰의 URI와 가격을 설정
        // 전체 토큰 수를 증가 시킴
        _tokenIds.increment();
        // 새로 생성되는 토큰의 id 가져옴
        uint256 newItemId = _tokenIds.current();
        // 새 토큰 발행
        _mint(recipient, newItemId);
        // 새토큰 URI 설정
        _setTokenURI(newItemId, tokenUriParam);
        // 토큰 정보를 매핑한 item에 저장
        _items[newItemId] = Item(newItemId, recipient, price);
        // id 반환
        return newItemId;
    }

    function buyNFT(uint256 tokenId) public payable { //payable로 선언, ETH와 동반 호출 가능
    // token을 구매하는 함수
        // 토큰이 실제로 존재하는지 확인
        require(_exists(tokenId), "Error: wrong TokenId");
        // 전송된 이더의 양이 토큰의 가격과 일치하는지 확인
        require(msg.value >= _items[tokenId].price, "Error: the ETH value sent is not correct");
        // 구매할 토큰의 현재 소유자 주소
        address previousOwner = _items[tokenId].owner;
        // : 토큰을 현재 소유자로부터 호출자에게 전송
        _transfer(previousOwner, msg.sender, tokenId);
        // 이더를 현재 소유자에게 전송
        payable(previousOwner).transfer(msg.value);
        // 토큰의 소유자를 호출자로 설정
        _items[tokenId].owner = msg.sender;
    }

    function getItem(uint256 tokenId) public view returns (uint256 id, address owner, uint256 price) {
    // 특정 토큰의 정보를 가져오는 함수
        require(_exists(tokenId), "Error: wrong TokenId");
        //입력으로 token의 id 요구
        Item memory item = _items[tokenId];
        return (item.id, item.owner, item.price);
        // 정상적인 입력을 받으면 해당 token의 item들을 반환
    }
}
