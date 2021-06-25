// OpenZeppelin ERC20 Tests Runner
// See https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/test/token/ERC20/

// token constants
const {
	NAME,
	SYMBOL,
	DECIMALS,
	TOTAL_SUPPLY: S0,
} = require("./include/ali_erc20_constants");

// ACL token features and roles
const {
	ROLE_TOKEN_CREATOR,
	ROLE_TOKEN_DESTROYER,
} = require("./include/ali_erc20_features_roles");

// Zeppelin unit tests – delivered as behaviours
// basic ERC20 behaviours
const {
	shouldBehaveLikeERC20,
	shouldBehaveLikeERC20Transfer, // TODO: use it to verify ERC1363 transfers
	shouldBehaveLikeERC20Approve,  // TODO: use it to verify ERC1363 approvals
} = require("./include/zeppelin/ERC20.behavior");
// extended ERC20 behaviours
const {
	shouldHaveBasicProps,
	shouldHaveAtomicApprove,
	shouldHaveMint,
	shouldHaveBurn,
} = require("./include/zeppelin/ERC20.behavior.ext");

// deployment routines in use
const {ali_erc20_deploy} = require("./include/deployment_routines");

// run OpenZeppelin ERC20 tests
contract("AliERC20: OpenZeppelin ERC20 Tests", function(accounts) {
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

	function run_zeppelin_erc20_tests(S0, H0, a1, a2) {
		// Zeppelin global setup
		beforeEach(async function() {
			// Zeppelin uses this.token shortcut to access token instance
			this.token = ali;
		});

		describe("ALI ERC20 shouldBehaveLikeERC20", function() {
			// Zeppelin setup for ERC20 transfers: not required, full set of features already on deployment
			shouldBehaveLikeERC20("", S0, H0, a1, a2);
		});
		describe("ALI shouldHaveMint (ext)", function() {
			// Zeppelin setup for token minting
			beforeEach(async function() {
				// Zeppelin uses default zero account A0 (accounts[0]) to mint tokens,
				// grant this address a permission to mint
				await ali.updateRole(A0, ROLE_TOKEN_CREATOR, {from: a0});
			});
			shouldHaveMint("", S0, H0, a1);
		});
		describe("ALI shouldHaveBurn (ext)", function() {
			// Zeppelin setup for token burning
			beforeEach(async function() {
				// Zeppelin uses default zero account A0 (accounts[0]) to burn tokens,
				// grant this address a permission to burn
				await ali.updateRole(A0, ROLE_TOKEN_DESTROYER, {from: a0});
			});
			shouldHaveBurn("", S0, H0);
		});
		describe("ALI shouldHaveBasicProps (ext)", function() {
			shouldHaveBasicProps(NAME, SYMBOL, DECIMALS);
		});
		describe("ALI ERC20 shouldHaveApprove (ext)", function() {
			shouldHaveAtomicApprove("", S0, H0, a1);
		});
	}

	describe("without voting delegation involved", function() {
		run_zeppelin_erc20_tests(S0, H0, a1, a2);
	});
	describe("with voting delegation involved", function() {
		// Zeppelin setup for case with delegation involved
		beforeEach(async function() {
			// delegate voting powers of accounts to themselves
			await ali.delegate(H0, {from: H0});
			await ali.delegate(a1, {from: a1});
			await ali.delegate(a2, {from: a2});
		});
		run_zeppelin_erc20_tests(S0, H0, a1, a2);
	});
});
