// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

/**
 * @title NFT Mock
 *
 * @notice NFT Mock simulates an NFT token, used for testing purposes;
 *      it has unrestricted access to the mint() function and can be used to be bound to an iNFT
 *
 * @author Basil Gorin
 */
contract NFTMock is ERC721Enumerable {
	/**
	 * @dev Creates/deploys an NFT Mock instance
	 */
	constructor() ERC721("NFT Mock", "NFT") {}

	/**
	 * @dev Mints `tokenId` and transfers it to `to`.
	 *
	 * See {ERC721._safeMint}
	 *
	 * @param to an address to mint token to
	 * @param tokenId token ID to mint
	 */
	function mint(address to, uint256 tokenId) public {
		// mint token safely - delegate to `_safeMint`
		_safeMint(to, tokenId);
	}
}
