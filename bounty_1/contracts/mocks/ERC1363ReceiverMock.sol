// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../interfaces/ERC1363Receiver.sol";

// mock class using IERC1363Receiver
contract ERC1363ReceiverMock is ERC1363Receiver {
    bytes4 private _retval;
    bool private _reverts;

    event Received(
        address operator,
        address sender,
        uint256 amount,
        bytes data,
        uint256 gas
    );

    constructor(bytes4 retval, bool reverts) {
        _retval = retval;
        _reverts = reverts;
    }

    function onTransferReceived(address operator, address sender, uint256 amount, bytes memory data) public override returns (bytes4) {
        require(!_reverts, "ERC1363ReceiverMock: throwing");
        emit Received(operator, sender, amount, data, gasleft());
        return _retval;
    }
}
