// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RandomNumberGame {
    uint256 private randomNumber;
    address payable public winner;
    enum Message { Win, Up, Down }
    Message public message;

    event messageEvent(string _message);

    constructor() payable {
        randomNumber = generateRandomNumber();
    }

    function guess(uint256 _guessNumber) public payable {
        require(msg.value == 1 ether, "1 ETH is needed to guess");

        if (_guessNumber == randomNumber) {
            winner = payable(msg.sender);
            winner.transfer(address(this).balance);
            randomNumber = generateRandomNumber();
            message = Message.Win;
            emit messageEvent(getMessage());
        } else if (_guessNumber < randomNumber) {
            message = Message.Up;
            emit messageEvent(getMessage());
        } else {
            message = Message.Down;
            emit messageEvent(getMessage());
        }
    }

    function generateRandomNumber() private view returns (uint256) {
        return (uint256(keccak256(abi.encodePacked(
            block.timestamp, blockhash(block.number - 1)))) % 100) + 1;
    }

    function getMessage() public view returns (string memory) {
        if (message == Message.Win) { return "Win"; }
        else if (message == Message.Up) { return "Up"; }
        else if (message == Message.Down) { return "Down"; }
        else { return "You need to guess first"; }
    }
}
