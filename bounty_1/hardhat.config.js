// Enable Truffle 5 plugin for tests
// https://hardhat.org/guides/truffle-testing.html
require("@nomiclabs/hardhat-truffle5");

// Enable Waffle plugin for deployments
require("@nomiclabs/hardhat-waffle");

// enable etherscan integration
// https://hardhat.org/plugins/nomiclabs-hardhat-etherscan.html
require("@nomiclabs/hardhat-etherscan");

// enable Solidity-coverage
// https://hardhat.org/plugins/solidity-coverage.html
require('solidity-coverage');

module.exports = {
	defaultNetwork: "hardhat",
	networks: {
		// https://hardhat.org/hardhat-network/
		hardhat: {
			// TODO: set networkId to 0xeeeb04de as for all local networks
			accounts: {
				count: 35,
			}
		},
		// https://etherscan.io/
		mainnet: {
			// url: "https://eth-mainnet.alchemyapi.io/v2/123abc123abc123abc123abc123abcde",
			url: "https://mainnet.infura.io/v3/" + process.env.INFURA_KEY, // create a key: https://infura.io/
			gasPrice: 21000000000, // 21 Gwei
			accounts: {
				mnemonic: process.env.MNEMONIC1, // create 12 words: https://metamask.io/
			}
		},
		// https://rinkeby.etherscan.io/
		rinkeby: {
			url: "https://rinkeby.infura.io/v3/" + process.env.INFURA_KEY, // create a key: https://infura.io/
			gasPrice: 2000000000, // 2 Gwei
			accounts: {
				mnemonic: process.env.MNEMONIC4, // create 12 words: https://metamask.io/
			}
		}
	},

	// Configure Solidity compiler
	solidity: {
		// https://hardhat.org/guides/compile-contracts.html
		compilers: [
			{
				// Release v0.1-no_token
				version: "0.8.4",
				settings: {
					optimizer: {
						enabled: true,
						runs: 200
					}
				}
			},
		]
	},

	// Set default mocha options here, use special reporters etc.
	mocha: {
		// timeout: 100000,

		// disable mocha timeouts:
		// https://mochajs.org/api/mocha#enableTimeouts
		enableTimeouts: false,
		// https://github.com/mochajs/mocha/issues/3813
		timeout: false,
	},

	// Configure etherscan integration
	// https://hardhat.org/plugins/nomiclabs-hardhat-etherscan.html
	etherscan: {
		// Your API key for Etherscan
		// Obtain one at https://etherscan.io/
		apiKey: process.env.ETHERSCAN_KEY
	}
}
