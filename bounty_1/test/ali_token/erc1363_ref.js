// Ref ERC1363 Tests Runner
// See https://github.com/vittominacori/erc1363-payable-token/blob/master/test/

// token constants
const {TOTAL_SUPPLY: S0} = require("./include/ali_erc20_constants");

// Ref ERC1363 unit tests – delivered as behaviours
const {shouldBehaveLikeERC1363} = require("./include/erc1363/ERC1363.behaviour");
// Ref ERC1363 Payable unit tests – delivered as behaviours
// const {shouldBehaveLikeERC1363Payable} = require("./include/erc1363/ERC1363Payable.behaviour");

// deployment routines in use
const {ali_erc20_deploy} = require("./include/deployment_routines");

// run ref ERC1363 tests
contract("AliERC20: Ref ERC1363 Tests", function(accounts) {
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
		// ERC1363 global setup
		beforeEach(async function() {
			// Ref ERC1363 uses this.token shortcut to access token instance
			this.token = ali;
		});

		// execute Ref ERC1363 tests as behavior
		shouldBehaveLikeERC1363([H0, a1, a2], S0);

		// execute Ref ERC1363 Payable tests as behavior
		// shouldBehaveLikeERC1363Payable([H0, a1], S0);
	}
});
