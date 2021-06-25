// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

/**
 * @title EIP-165: ERC-165 Standard Interface Detection
 *
 * @notice Creates a standard method to publish and detect what interfaces a smart contract implements.
 *
 * @dev Interface of the ERC165 standard, as defined in the
 *      https://eips.ethereum.org/EIPS/eip-165[EIP].
 *
 * @dev Implementers can declare support of contract interfaces, which can then be
 *      queried by others ({ERC165Checker}).
 */
interface ERC165 {
	/**
	 * @dev Returns true if this contract implements the interface defined by
	 *      `interfaceId`. See the corresponding
	 *      https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section]
	 *      to learn more about how these ids are created.
	 *
	 * @dev This function call must use less than 30 000 gas.
	 *
	 * @param interfaceId The interface identifier, as specified in ERC-165
	 * @return `true` if the contract implements `interfaceID` and
	 *      `interfaceID` is not 0xffffffff, `false` otherwise
	 */
	function supportsInterface(bytes4 interfaceId) external view returns (bool);
}
