// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
pragma abicoder v2;

import "../lzApp/NonblockingLzApp.sol";
import "hardhat/console.sol";
/// @title A LayerZero example sending a cross chain message from a source chain to a destination chain to increment a counter
contract OmniCounter is NonblockingLzApp {
    uint public counter;
    bytes public message;
    constructor(address _lzEndpoint) NonblockingLzApp(_lzEndpoint) {
        
    }
    function _nonblockingLzReceive(uint16, bytes memory, uint64, bytes memory _message) internal override {
        console.log("block");
        counter += 1;
        message = _message;
    }

    function incrementCounter(uint16 _dstChainId, bytes calldata text) public payable {
        console.log("counter_send");
        console.logAddress(msg.sender);
        _lzSend(_dstChainId, text, payable(msg.sender), address(0x0), bytes(""), msg.value);
    }
}
