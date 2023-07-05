// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "./myERC721.sol";

contract myNFT is ERC721 {
    // ERC721 기능 구현

    /* 기능 구현을 위한 mapping */
    /* 주소가 소유한 NFT 개수 저장 */
    mapping(address => uint256) public tokenBalance;
    /* 토큰Id를 소유한 주소 저장 */
    mapping(uint256 => address) public tokenOwner;
    /* 토큰Id의 가격 저장 (판매중일 땐 5 ETH, 아니면 0) */
    mapping(uint256 => uint256) public tokenPrice;
    /* 토큰Id의 판매 여부 저장 */
    mapping(uint256 => bool) public isForSale;
    /* 토큰Id의 소유자 주소 내역 저장 */
    mapping(uint256 => address[]) public tokenOwnerHistory;

    // NFT 정의
    struct Image {
        string name;
        string url;
        string myAttributes;
        /* 원하는 만큼 속성을 정의 및 추가하셔도 됩니다. */
    }
    Image[] public images;

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(){}

    function mint(
        address _to,   // NFT를 발행하고 소유할 주소
        string memory _name,   // NFT의 이름
        string memory _url,   // NFT의 path
        string memory myAttributes   // NFT의 속성
    ) public {
        /* NFT를 소유하는 주소는 address(0)가 아니어야 함 */
        require(_to != address(0), "Empty address cannot mint NFT");
        uint _tokenId =  images.length; /* 토큰ID는 발행될 때마다 0부터 차례대로 부여 */
        require(!_exists(_tokenId), "1 tokenId can only be assigned to 1 NFT");
        /* 발행된 토큰Id를 서로 다른 두 NFT가 공유해서는 안 됨 */
        images.push(  /* images 배열에 발행된 NFT 추가 */
            Image(_name, _url, myAttributes)
        );
        tokenOwnerHistory[_tokenId].push(_to);
        /* 발행된 NFT의 소유주 기록에 발행자의 주소 추가 */
        _mint(_to, _tokenId);
    }

    // nft 발행 기능
    function _mint(address to, uint256 tokenId) internal {
        tokenOwner[tokenId] = to;
        tokenBalance[to] += 1;
        emit Transfer(address(0), to, tokenId);
    }

    // tokenId의 소유자 기록 반환
    function ownerHistoryOf(uint256 tokenId) public
        view returns (address[] memory) {
        return tokenOwnerHistory[tokenId];
    }

    // NFT id 생성 여부 확인
    function _exists(uint256 tokenId) internal
        view returns (bool) {
        /* tokenId의 소유자를 받아옵니다. */
        address owner = tokenOwner[tokenId];
        return owner != address(0);
    }   

    // 토큰의 소유자 계정 찾기
    function ownerOf(uint256 _tokenId) public
        view returns (address) {
        return tokenOwner[_tokenId];
    }

    // 토큰 판매 시작
    function sellToken(uint256 _tokenId) public {
        /* 함수를 호출하는 주소는 해당 토큰Id의 보유자여야 합니다. */
        require(msg.sender == tokenOwner[_tokenId], "Only owner can sell token");
        /* onSale 함수를 호출해 해당 토큰Id의 판매 상태를 true로 바꿉니다. */
        onSale(_tokenId, true);
        /* 토큰의 가격은 5 ETH로 고정합니다. */
        tokenPrice[_tokenId] = 5 ether;
    }

    // 토큰 판매 여부 설정
    function onSale(uint256 _tokenId, bool _forSale) public {
        isForSale[_tokenId] = _forSale;
    }

    // 토큰 판매 여부 확인
    function isOnSale(uint256 _tokenId) public
        view returns (bool) {
        return isForSale[_tokenId];
    }

    // 토큰 구매 기능
    function buyToken(uint256 _tokenId) public payable {
        /*
          유효성 확인:
          1 토큰이 판매중인가
          2 전송한 이더량이 토큰을 살 수 있는 양인가
          3 판매자와 구매자가 동일 인물이 아닌가
        */
        require(isOnSale(_tokenId), "Token is not on sale");
        require(msg.value >= tokenPrice[_tokenId], "Not enough ETH");
        address owner = ownerOf(_tokenId);
        require(msg.sender != owner, "You cannot buy your own token");

        /* 토큰의 가격만큼의 ETH를 판매자에게 전송 */
        payable(owner).transfer(tokenPrice[_tokenId]);
        /* 토큰을 구매자의 소유로 이동 */
        transferFrom(owner, msg.sender, _tokenId);
        /* 토큰 소유주 내역에 구매자의 주소 추가 */
        tokenOwnerHistory[_tokenId].push(msg.sender);
        /* 토큰 가격을 지불하고 남은 금액을 구매자에게 재전송 */
        payable(msg.sender).transfer(msg.value - tokenPrice[_tokenId]);
        
        /* 토큰의 판매 여부 초기화 */
        isForSale[_tokenId] = false;
        tokenPrice[_tokenId] = 0;
    }

    // 토큰 전송 기능
    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) public {
        /*
          전송하고자 하는 토큰Id의 소유자 주소를 가져와 유효성 검사:
          1 판매자가 빈 주소가 아니어야 하며 토큰Id의 소유자여야 함
          2 구매자가 빈 주소가 아니어야 함
        */
        address owner = tokenOwner[_tokenId];
        require(_from != address(0), "Validation Failed: Seller must not be empty address");
        require(owner == _from, "Validation Failed: Seller must be owner");
        require(_to != address(0), "Validation Failed: Buyer must not be empty address");
        /*
          각 주소가 보유한 토큰량을 가감하고
          토큰Id의 현 소유자 주소 변경
        */
        tokenBalance[_from] -= 1;
        tokenOwner[_tokenId] = address(0); // 소유자 주소 변경 전 초기화
        tokenBalance[_to] += 1;
        tokenOwner[_tokenId] = _to; // 새 소유자 주소로 업데이트
        /* 토큰 전송 이벤트 호출 */
        emit Transfer(owner, _to, _tokenId);
    }

    // 계좌 내 토큰 개수 확인
    function balanceOf(address _owner) public
        view override returns (uint256) {
        return tokenBalance[_owner];
    }
}