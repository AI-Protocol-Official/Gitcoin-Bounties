// ACL token features and roles
const {FEATURE_ALL} = require("./ali_erc20_features_roles");

/**
 * Deploys AliERC20 token with all the features enabled
 *
 * @param a0 smart contract owner, super admin
 * @param H0 initial token holder address
 * @returns AliERC20 instance
 */
async function ali_erc20_deploy(a0, H0 = a0) {
	// deploy ALI token
	const ali = await ali_erc20_deploy_restricted(a0, H0);

	// enable all permissions on the ALI token
	await ali.updateFeatures(FEATURE_ALL, {from: a0});

	// return the reference
	return ali;
}

/**
 * Deploys AliERC20 token with no features enabled
 *
 * @param a0 smart contract owner, super admin
 * @param H0 initial token holder address
 * @returns AliERC20 instance
 */
async function ali_erc20_deploy_restricted(a0, H0 = a0) {
	// smart contracts required
	const AliERC20 = artifacts.require("./AliERC20v2");

	// deploy ALI token and return the reference
	return await AliERC20.new(H0, {from: a0});
}

/**
 * Deploys AliERC20 token Comp mock with all the features enabled
 *
 * @param a0 smart contract owner, super admin
 * @param H0 initial token holder address
 * @returns AliERC20 instance
 */
async function ali_erc20_deploy_comp_mock(a0, H0 = a0) {
	// smart contracts required
	const AliCompMock = artifacts.require("./AliCompMock");

	// deploy ALI token Comp mock
	const comp_mock =  await AliCompMock.new(H0, {from: a0});

	// enable all permissions on the ALI token Comp mock
	await comp_mock.updateFeatures(FEATURE_ALL, {from: a0});

	// return the mock
	return comp_mock;
}

/**
 * Deploys ERC1363 acceptor, which can accept ERC1363 transfers/approvals
 *
 * @param a0 smart contract owner, super admin
 * @returns ERC1363Receiver/ERC1363Spender instance
 */
async function erc1363_deploy_acceptor(a0) {
	// smart contracts required
	const ERC1363Mock = artifacts.require("./ERC1363Mock");

	// deploy ERC1363 mock and return
	return await ERC1363Mock.new({from: a0});
}

// export public deployment API
module.exports = {
	ali_erc20_deploy,
	ali_erc20_deploy_restricted,
	ali_erc20_deploy_comp_mock,
	erc1363_deploy_acceptor,
};
