//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@layerzerolabs/solidity-examples/contracts/lzApp/NonblockingLzApp.sol";

contract OmniChat is NonblockingLzApp {
    struct Message {
        address from;
        address to;
        uint timestamp;
        string text;
    }
    mapping(bytes32 => Message[]) messages;

    constructor(address _lzEndpoint) NonblockingLzApp(_lzEndpoint) {}

    function sendMessage(uint16 dstChainId, address dstAccountAddress, string calldata text) external payable {
        bytes memory payload = abi.encode(msg.sender, dstAccountAddress, block.timestamp, text);
        _lzSend(dstChainId, payload, payable(msg.sender), address(0x0), bytes(""));
    }

    function _nonblockingLzReceive(uint16 srcChainId, bytes memory, uint64, bytes memory payload) internal override {
        (address from, address to, uint timestamp, string memory text) = abi.decode(payload, (address, address, uint, string));
        
        Message memory message = Message(from, to, timestamp, text);
        bytes32 chatId = getChatId(srcChainId, from, to);

        messages[chatId].push(message);
    }

    function getMessages(uint16 chainId, address counterpartAddress) external view returns(Message[] memory) {
        bytes32 chatId = getChatId(chainId, msg.sender, counterpartAddress);
        return messages[chatId];
    }

    function getChatId(uint16 chainId, address address1, address address2) internal pure returns(bytes32) {
        (address addressA, address addressB) = address1 < address2 ? (address1, address2) : (address2, address1);
        return keccak256(abi.encode(chainId, addressA, addressB));
    } 
}
