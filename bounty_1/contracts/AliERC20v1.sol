// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";

/**
 * @title Artificial Liquid Intelligence ERC20 Token
 *       (Alethea, Alethea Token, ALI)
 *       Version 1
 *
 * @notice ALI is the native utility token of the Alethea AI Protocol.
 *
 * @dev Standard burnable, non-mintable Zeppelin-based implementation: Version 1
 *
 * @author Basil Gorin
 */
contract AliERC20v1 is ERC20, ERC165 {
	/**
	 * @dev Creates/deploys an ALI token ERC20 instance
	 */
	constructor() ERC20("Alethea Token", "ALI") {
		// mint 10 billion initial token supply to the deployer
		_mint(msg.sender, 10_000_000_000 ether); // we use "ether" suffix instead of "e18"
	}

	/**
	 * @inheritdoc IERC165
	 */
	function supportsInterface(bytes4 interfaceId) public view override returns (bool) {
		// reconstruct from current interface and super interface
		return interfaceId == type(IERC20).interfaceId
			|| interfaceId == type(IERC20Metadata).interfaceId
			|| super.supportsInterface(interfaceId);
	}

	/**
	 * @notice Destroys some tokens from transaction sender account,
	 *      reducing the total supply.
	 *
	 * @dev Emits a {Transfer} event with `to` set to the zero address.
	 * @dev Throws if transaction sender doesn't have at least `amount` tokens.
	 *
	 * @param amount amount of tokens to burn
	 */
	function burn(uint256 amount) public {
		// delegate to super `_burn`
		_burn(_msgSender(), amount);
	}
}
