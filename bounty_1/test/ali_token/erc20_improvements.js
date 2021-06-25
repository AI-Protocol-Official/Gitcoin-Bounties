// Alethea ERC20: ERC20 Improvements Tests

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

// token constants
const {
	DM,
	TOTAL_SUPPLY: S0,
} = require("./include/ali_erc20_constants");

// deployment routines in use
const {ali_erc20_deploy} = require("./include/deployment_routines");

// run tests for ERC20 improvements required
contract("AliERC20: ERC20 Improvements Required", function(accounts) {
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

	// Support for atomic allowance modification, resolution of well-known ERC20 issue with approve
	// – is checked in a separate Zeppelin ERC20 test file

	describe("It should be possible to set ERC20 allowance to “unlimited” value (2**256-1)", function() {
		const owner = H0;
		const to = a1;
		const spender = a2;
		const valueToSpend = S0;
		describe("when allowance is *not* set to “unlimited”", function() {
			// initial allowance value: not “unlimited”
			const oldValue = MAX_UINT256.subn(1);
			// new allowance value
			const value = oldValue.sub(valueToSpend);
			beforeEach(async function() {
				await ali.approve(spender, oldValue, {from: owner});
			});
			describe("transfer on behalf changes the allowance", function() {
				let receipt;
				beforeEach(async function() {
					receipt = await ali.transferFrom(owner, to, valueToSpend, {from: spender});
				});
				it("changes allowance value", async function() {
					expect(await ali.allowance(owner, spender)).to.be.bignumber.that.equals(value);
				});
				it("emits Approved event", async function() {
					expectEvent(receipt, "Approved", {owner, spender, oldValue, value});
				});
				it("emits Approval event", async function() {
					expectEvent(receipt, "Approval", {owner, spender, value});
				});
			});
		});
		describe("when allowance is set to “unlimited”", function() {
			// initial allowance value: not “unlimited”
			const oldValue = MAX_UINT256;
			// new allowance value: not changed
			const value = oldValue;
			beforeEach(async function() {
				await ali.approve(spender, oldValue, {from: owner});
			});
			describe("transfer on behalf doesn't change the allowance", function() {
				let receipt;
				beforeEach(async function() {
					receipt = await ali.transferFrom(owner, to, valueToSpend, {from: spender});
				});
				it("doesn't change allowance value", async function() {
					expect(await ali.allowance(owner, spender)).to.be.bignumber.that.equals(value);
				});
				it("doesn't emit Approved event", async function() {
					expectEvent.notEmitted(receipt, "Approved");
				});
				it("doesn't emit Approval event", async function() {
					expectEvent.notEmitted(receipt, "Approval");
				});
			});
		});
	});
});
