// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Greeter {

    /* 먼저 greeting 문자열만 반환되게 하세요. */
    string public greeting;
    
    struct Greeting {
        address sender;
        string message;
    }
    Greeting[] public greetings;


    /* greeting의 초기값은 "Hello World!" */
    constructor() {
        greeting = "Hello World!";
        greetings.push(Greeting({
            sender: msg.sender,
            message: "Hello World!"
        }));
    }

    // 입력받은 인사말을 저장하고 그 인사말을 배열에 추가합니다.
    function setGreeting(string memory _greeting) public {
        greeting = _greeting;
        greetings.push(Greeting({
            sender: msg.sender,
            message: _greeting
        }));
    }

    // 가장 최근의 인사말을 반환합니다.
    function greet() view public returns (string memory) {
        return greeting;
    }

    // 지금까지 기록된 모든 인사말을 반환합니다.
    function greetingHistory() view public returns (Greeting[] memory) {
        return greetings;
    }
}
