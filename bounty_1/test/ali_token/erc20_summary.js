// Alethea ERC20: Token Summary Tests

// Zeppelin test helpers
const {
	BN,
	constants,
	expectEvent,
	expectRevert,
} = require("@openzeppelin/test-helpers");
const {
	assert,
	expect,
} = require("chai");
const {
	ZERO_ADDRESS,
	ZERO_BYTES32,
	MAX_UINT256,
} = constants;

// BN constants and utilities
const {random_bn} = require("./include/bn_utils");

// token constants
const {
	DM,
	TOTAL_SUPPLY: S0,
} = require("./include/ali_erc20_constants");

// ACL token features and roles
const {
	FEATURE_OWN_BURNS,
	FEATURE_BURNS_ON_BEHALF,
	FEATURE_DELEGATIONS,
	ROLE_TOKEN_CREATOR,
	ROLE_TOKEN_DESTROYER,
	FULL_PRIVILEGES_MASK,
} = require("./include/ali_erc20_features_roles");

// deployment routines in use
const {ali_erc20_deploy_restricted} = require("./include/deployment_routines");

// run very basic token tests
contract("AliERC20: Token Summary", function(accounts) {
	// extract accounts to be used:
	// A0 – special default zero account accounts[0] used by Web3, reserved
	// a0 – deployment account having all the permissions, reserved
	// H0 – initial token holder account
	// a1, a2,... – working accounts to perform tests on
	const [A0, a0, H0, a1, a2] = accounts;

	let ali;
	beforeEach(async function() {
		ali = await ali_erc20_deploy_restricted(a0, H0);
	});

	it("Symbol: ALI", async function() {
		expect(await ali.symbol()).to.equal("ALI");
	});
	it("Name: Artificial Liquid Intelligence Token", async function() {
		expect(await ali.name()).to.equal("Artificial Liquid Intelligence Token");
	});
	it("Decimals: 18", async function() {
		expect(await ali.decimals()).to.be.a.bignumber.that.equals('18');
	});
	it("Initial total supply: 10,000,000,000 ALI", async function() {
		expect(await ali.totalSupply()).to.be.a.bignumber.that.equals(new BN(10).pow(new BN(1 + 9 + 18)));
	});
	it("Initial supply holder: H0 – " + H0, async function() {
		expect(await ali.balanceOf(H0)).to.be.a.bignumber.that.equals(S0);
	});

	const by = a1;
	const to = H0;
	const from = H0;
	const value = random_bn(new BN(1_500_000_000).mul(DM), new BN(1_500_000_000).mul(DM));

	describe("Mintable during deployment: new tokens may get created during deployment", function() {
		function behaves_like_mint(by, to, value) {
			let receipt;
			beforeEach(async function() {
				receipt = await ali.mint(to, value, {from: by});
			});
			it("total supply increases", async function() {
				expect(await ali.totalSupply()).to.be.a.bignumber.that.equals(S0.add(value));
			});
			it("holder balance increases", async function() {
				expect(await ali.balanceOf(to)).to.be.a.bignumber.that.equals(S0.add(value));
			});
			it("emits Minted event", async function() {
				expectEvent(receipt, "Minted", {by, to, value})
			});
			it("emits Transferred event", async function() {
				expectEvent(receipt, "Transferred", {by, from: ZERO_ADDRESS, to, value})
			});
			it("emits ERC20 Transfer event", async function() {
				expectEvent(receipt, "Transfer", {from: ZERO_ADDRESS, to, value})
			});
		}

		describe("by TOKEN_CREATOR", function() {
			beforeEach(async function() {
				await ali.updateRole(by, ROLE_TOKEN_CREATOR, {from: a0});
			});
			describe("tokens get created", function() {
				behaves_like_mint(by, to, value);
			});
		});
		it("not when TOKEN_CREATOR permission is missing", async function() {
			await expectRevert(ali.mint(to, value, {from: by}), "access denied");
		});
	});
	describe("Not mintable after deployment: new tokens cannot be created after deployment", function() {
		beforeEach(async function() {
			await ali.updateRole(by, FULL_PRIVILEGES_MASK.xor(new BN(ROLE_TOKEN_CREATOR)), {from: a0});
		});
		it("minting by the deployer reverts", async function() {
			await expectRevert(ali.mint(to, value, {from: by}), "access denied");
		});
	});
	describe("Burnable: existing tokens may get destroyed", function() {
		function behaves_like_burn(by, from, value) {
			let receipt;
			beforeEach(async function() {
				receipt = await ali.burn(from, value, {from: by});
			});
			it("total supply decreases", async function() {
				expect(await ali.totalSupply()).to.be.a.bignumber.that.equals(S0.sub(value));
			});
			it("holder balance decreases", async function() {
				expect(await ali.balanceOf(from)).to.be.a.bignumber.that.equals(S0.sub(value));
			});
			it("emits Burnt event", async function() {
				expectEvent(receipt, "Burnt", {by, from, value})
			});
			it("emits Transferred event", async function() {
				expectEvent(receipt, "Transferred", {by, from, to: ZERO_ADDRESS, value})
			});
			it("emits ERC20 Transfer event", async function() {
				expectEvent(receipt, "Transfer", {from, to: ZERO_ADDRESS, value})
			});
		}

		describe("by TOKEN_DESTROYER", function() {
			beforeEach(async function() {
				await ali.updateRole(by, ROLE_TOKEN_DESTROYER, {from: a0});
			});
			behaves_like_burn(by, from, value);
		});
		describe("by tokens owner", function() {
			beforeEach(async function() {
				await ali.updateRole(from, 0, {from: a0});
			});
			describe("when OWN_BURNS is enabled", function() {
				beforeEach(async function() {
					await ali.updateFeatures(FEATURE_OWN_BURNS, {from: a0});
				});
				behaves_like_burn(from, from, value);
			});
			it("not when OWN_BURNS is disabled", async function() {
				await expectRevert(ali.burn(from, value, {from: from}), "burns are disabled");
			});
		});
		describe("on behalf of tokens owner", function() {
			beforeEach(async function() {
				await ali.updateRole(from, 0, {from: a0});
			});
			describe("when BURNS_ON_BEHALF is enabled", function() {
				beforeEach(async function() {
					await ali.updateFeatures(FEATURE_BURNS_ON_BEHALF, {from: a0});
				});
				describe("when token owner approved operation", function() {
					beforeEach(async function() {
						await ali.approve(by, value, {from: from});
					});
					behaves_like_burn(by, from, value);
				});
				it("not when token owner didn't approve operation", async function() {
					await expectRevert(ali.burn(from, value, {from: by}), "burn amount exceeds allowance");
				});
			});
			it("not when BURNS_ON_BEHALF is disabled", async function() {
				await expectRevert(ali.burn(from, value, {from: by}), "burns on behalf are disabled");
			});
		});
	});
	describe("Token holders should be able participate in governance protocol(s) and vote with their tokens", function() {
		describe("when delegations are enabled", function() {
			beforeEach(async function() {
				await ali.updateFeatures(FEATURE_DELEGATIONS, {from: a0});
			});
			describe("when token holder address delegates to itself", function() {
				let receipt;
				beforeEach(async function() {
					receipt = await ali.delegate(H0, {from: H0});
				});
				it("it becomes a delegate of itself", async function() {
					expect(await ali.votingDelegates(H0)).to.equal(H0);
				});
				it("it receives voting power equal to the token balance", async function() {
					expect(await ali.votingPowerOf(H0)).to.be.bignumber.that.equals(S0);
				});
				it("VotingPowerChanged event is emitted", async function() {
					expectEvent(receipt, "VotingPowerChanged", {by: H0, target: H0, fromVal: new BN(0), toVal: S0})
				});
				it("DelegateChanged event is emitted", async function() {
					expectEvent(receipt, "DelegateChanged", {source: H0, from: ZERO_ADDRESS, to: H0})
				});
			});
		});
		describe("otherwise", function() {
			it("delegation reverts", async function() {
				await expectRevert(ali.delegate(H0, {from: H0}), "delegations are disabled");
			})
		});
	});

});
