// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../interfaces/ERC1363Receiver.sol";
import "../interfaces/ERC1363Spender.sol";

/// @dev Mock for ERC1363Receiver/ERC1363Spender interfaces
contract ERC1363Mock is ERC1363Receiver, ERC1363Spender {
	// an event to be fired in `onTransferReceived`
	event OnTransferReceived(address indexed operator, address indexed from, uint256 value, bytes data);
	// an event to be fired in `onApprovalReceived`
	event OnApprovalReceived(address indexed owner, uint256 value, bytes data);

	/// @inheritdoc ERC1363Receiver
	function onTransferReceived(address operator, address from, uint256 value, bytes memory data) public override returns (bytes4) {
		// emit an event
		emit OnTransferReceived(operator, from, value, data);

		// always return "success"
		return ERC1363Receiver(this).onTransferReceived.selector;
	}

	/// @inheritdoc ERC1363Spender
	function onApprovalReceived(address owner, uint256 value, bytes memory data) external override returns (bytes4) {
		// emit an event
		emit OnApprovalReceived(owner, value, data);

		// always return "success"
		return ERC1363Spender(this).onApprovalReceived.selector;
	}
}
