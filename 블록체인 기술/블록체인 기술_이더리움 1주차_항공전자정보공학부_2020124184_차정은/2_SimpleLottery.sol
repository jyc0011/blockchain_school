// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleLottery{
    address public manager;
    address payable[] public players;

    constructor() {
        manager = msg.sender;
    }

    function enter() public payable {
        require(msg.value >= 1 ether, "Must send at least 1 ETH to enter");
        players.push(payable(msg.sender));
    }

    function random() private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, players.length)));
    }

    function pickWinner() public managerOnly {
        uint index = random() % players.length;
        players[index].transfer(address(this).balance);
        players = new address payable[](0);
    }

    modifier managerOnly {
        require(msg.sender == manager, "Only manager can call this function");
        _;
    }
}