// OpenZeppelin EIP2612 Tests Runner
// See https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/test/token/ERC20/extensions/

// token constants
const {
	CONTRACT_NAME,
	SYMBOL,
	TOTAL_SUPPLY: S0,
} = require("./include/ali_erc20_constants");

// Zeppelin EIP2612 unit tests – delivered as behaviours
const {shouldBehaveLikeEIP2612} = require("./include/zeppelin/EIP2612.behavior");

// deployment routines in use
const {ali_erc20_deploy} = require("./include/deployment_routines");

// run OpenZeppelin EIP2612 tests
contract("AliERC20: OpenZeppelin EIP2612 Tests", function(accounts) {
	// extract accounts to be used:
	// A0 – special default zero account accounts[0] used by Web3, reserved
	// a0 – deployment account having all the permissions, reserved
	// H0 – initial token holder account
	// a1, a2,... – working accounts to perform tests on
	const [A0, a0, H0, a1, a2] = accounts;

	let ali;
	beforeEach(async function() {
		ali = await ali_erc20_deploy(a0, H0);
	});

	{
		// Zeppelin global setup
		beforeEach(async function() {
			// Zeppelin uses this.token shortcut to access token instance
			this.token = ali;
		});

		// execute Zeppelin EIP2612 tests as behavior
		shouldBehaveLikeEIP2612(CONTRACT_NAME, SYMBOL, S0, H0, a1);
	}
});
