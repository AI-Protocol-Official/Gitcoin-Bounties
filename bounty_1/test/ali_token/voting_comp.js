// Compound-like Voting Delegation Tests Runner
// See https://github.com/compound-finance/compound-protocol/blob/master/tests/Governance/
// Note: CompScenarioTest.js not in scope

// token constants
const {
	NAME,
	CONTRACT_NAME,
	SYMBOL,
	TOTAL_SUPPLY: S0,
} = require("./include/ali_erc20_constants");

// Compound unit tests – delivered as behaviours
const {shouldBehaveLikeComp} = require("./include/comp/Comp.behavior");

// deployment routines in use
const {ali_erc20_deploy_comp_mock} = require("./include/deployment_routines");

// run Compound-like voting delegation tests
contract("AliERC20: Compound-like Voting Delegation Tests", function(accounts) {
	// extract accounts to be used:
	// A0 – special default zero account accounts[0] used by Web3, reserved
	// a0 – deployment account having all the permissions, reserved
	// H0 – initial token holder account
	// a1, a2,... – working accounts to perform tests on
	const [A0, a0, H0, a1, a2, a3, a4, a5] = accounts;

	let ali;
	beforeEach(async function() {
		ali = await ali_erc20_deploy_comp_mock(a0, H0);
	});

	{
		// create empty account with known private key
		const w = web3.eth.accounts.create();
		// override a1 with the account with known private key
		const a1 = w.address;
		const a1_pk = w.privateKey;

		// Compound global setup
		beforeEach(async function() {
			// Compound-like uses this.comp shortcut to access token instance
			this.comp = ali;
		});

		// execute Compound tests, passing accounts as Compound expects
		shouldBehaveLikeComp(NAME, CONTRACT_NAME, SYMBOL, S0, H0, a1, a2, a3, a1_pk);
	}
});
