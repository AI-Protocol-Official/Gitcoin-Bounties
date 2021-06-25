// copy and export all the features and roles constants from AliERC20

// Auxiliary BN stuff
const BN = web3.utils.BN;
const TWO = new BN(2);

// Enables ERC20 transfers of the tokens (transfer by the token owner himself)
const FEATURE_TRANSFERS = 0x0000_0001;

// Enables ERC20 transfers on behalf (transfer by someone else on behalf of token owner)
const FEATURE_TRANSFERS_ON_BEHALF = 0x0000_0002;

// Defines if the default behavior of `transfer` and `transferFrom`
// checks if the receiver smart contract supports ERC20 tokens
const FEATURE_UNSAFE_TRANSFERS = 0x0000_0004;

// Enables token owners to burn their own tokens, including locked tokens which are burnt first
const FEATURE_OWN_BURNS = 0x0000_0008;

// Enables approved operators to burn tokens on behalf of their owners, including locked tokens which are burnt first
const FEATURE_BURNS_ON_BEHALF = 0x0000_0010;

// Enables delegators to elect delegates
const FEATURE_DELEGATIONS = 0x0000_0020;

// Enables delegators to elect delegates on behalf (via an EIP712 signature)
const FEATURE_DELEGATIONS_ON_BEHALF = 0x0000_0040;

// Enables ERC-1363 transfers with callback
const FEATURE_ERC1363_TRANSFERS = 0x0000_0080;

// Enables ERC-1363 approvals with callback
const FEATURE_ERC1363_APPROVALS = 0x0000_0100;

// Enables approvals on behalf (EIP2612 permits via an EIP712 signature)
const FEATURE_EIP2612_PERMITS = 0x0000_0200;

// Enables meta transfers on behalf (EIP3009 transfers via an EIP712 signature)
const FEATURE_EIP3009_TRANSFERS = 0x0000_0400;

// Enables meta transfers on behalf (EIP3009 transfers via an EIP712 signature)
const FEATURE_EIP3009_RECEPTIONS = 0x0000_0800;

// All the features all together
const FEATURE_ALL = 0x0000_FFFF;

// Token creator is responsible for creating (minting) tokens to an arbitrary address
const ROLE_TOKEN_CREATOR = 0x0001_0000;

// Token destroyer is responsible for destroying (burning) tokens owned by an arbitrary address
const ROLE_TOKEN_DESTROYER = 0x0002_0000;

// ERC20 receivers are allowed to receive tokens without ERC20 safety checks,
// which may be useful to simplify tokens transfers into "legacy" smart contracts
const ROLE_ERC20_RECEIVER = 0x0004_0000;

// ERC20 senders are allowed to send tokens without ERC20 safety checks,
// which may be useful to simplify tokens transfers into "legacy" smart contracts
const ROLE_ERC20_SENDER = 0x0008_0000;

// Access manager is responsible for assigning the roles to users,
// enabling/disabling global features of the smart contract
const ROLE_ACCESS_MANAGER = TWO.pow(new BN(255));

// Bitmask representing all the possible permissions (super admin role)
const FULL_PRIVILEGES_MASK = TWO.pow(new BN(256)).subn(1);

// export all the copied constants
module.exports = {
	FEATURE_TRANSFERS,
	FEATURE_TRANSFERS_ON_BEHALF,
	FEATURE_UNSAFE_TRANSFERS,
	FEATURE_OWN_BURNS,
	FEATURE_BURNS_ON_BEHALF,
	FEATURE_DELEGATIONS,
	FEATURE_DELEGATIONS_ON_BEHALF,
	FEATURE_ERC1363_TRANSFERS,
	FEATURE_ERC1363_APPROVALS,
	FEATURE_EIP2612_PERMITS,
	FEATURE_EIP3009_TRANSFERS,
	FEATURE_EIP3009_RECEPTIONS,
	FEATURE_ALL,
	ROLE_TOKEN_CREATOR,
	ROLE_TOKEN_DESTROYER,
	ROLE_ERC20_RECEIVER,
	ROLE_ERC20_SENDER,
	ROLE_ACCESS_MANAGER,
	FULL_PRIVILEGES_MASK,
};
