// Coinbase EIP3009 Tests Runner
// See https://github.com/CoinbaseStablecoin/eip-3009/blob/master/test/

// token constants
const {TOTAL_SUPPLY: S0} = require("./include/ali_erc20_constants");

// Coinbase EIP3009 unit tests – delivered as behaviours
const {shouldBehaveLikeEIP3009} = require("./include/coinbase/EIP3009.behavior");

// deployment routines in use
const {ali_erc20_deploy} = require("./include/deployment_routines");

// run Coinbase EIP3009 tests
contract("AliERC20: Coinbase EIP3009 Tests", function(accounts) {
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
		// Coinbase global setup
		beforeEach(async function() {
			// Coinbase uses this.token shortcut to access token instance
			this.token = ali;
		});

		// execute Coinbase EIP3009 tests as behavior
		shouldBehaveLikeEIP3009(S0, H0, a1);
	}
});
