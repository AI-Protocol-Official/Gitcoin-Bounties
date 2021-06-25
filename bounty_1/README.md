# Alethea Smart Contracts #
This repo contains Alethea ERC20 token (ALI), AI Pod ERC721 token, and Intelligent Token (iNFT).

The project is built using
* [Hardhat](https://hardhat.org/), a popular Ethereum development environment,
* [Web3.js](https://web3js.readthedocs.io/), a collection of libraries that allows to interact with
local or remote Ethereum node using HTTP, IPC or WebSocket, and
* [Truffle](https://www.trufflesuite.com/truffle), a popular development framework for Ethereum.

Smart contracts deployment is configured to use [Infura](https://infura.io/)
and [HD Wallet](https://www.npmjs.com/package/@truffle/hdwallet-provider)

## Installation ##

Following steps were tested to work in macOS Catalina

1. Clone the repository  
    ```git clone TBD```
2. Navigate into the cloned repository  
    ```cd alethea-contracts```
3. Install [Node Version Manager (nvm)](https://github.com/nvm-sh/nvm) – latest  
    ```brew install nvm```
4. Install [Node package manager (npm)](https://www.npmjs.com/) and [Node.js](https://nodejs.org/) – version 15.1.0  
    ```nvm install v15.1.0```
5. Activate node version installed  
    ```nvm use v15.1.0```
6. Install project dependencies  
    ```npm install```

#### Troubleshooting ####
* After executing ```nvm use v15.1.0``` I get  
    ```
    nvm is not compatible with the npm config "prefix" option: currently set to "/usr/local/Cellar/nvm/0.35.3/versions/node/v15.1.0"
    Run `npm config delete prefix` or `nvm use --delete-prefix v15.1.0` to unset it.
    ```
    Fix:  
    ```
    nvm use --delete-prefix v15.1.0
    npm config delete prefix
    npm config set prefix "/usr/local/Cellar/nvm/0.35.3/versions/node/v15.1.0"
    ```

## Configuration ##
1. Create or import 12-word mnemonics for
    1. Mainnet
    2. Ropsten
    3. Rinkeby
    4. Kovan

    You can use metamask to create mnemonics: https://metamask.io/

    Note: you can use same mnemonic for test networks (ropsten, rinkeby and kovan).
    Always use a separate one for mainnet, keep it secure.

2. Create an infura access key at https://infura.io/

3. Create etherscan API key at https://etherscan.io/

4. Export mnemonics, infura access key, and etherscan API key as system environment variables
    (they should be available for hardhat):

    | Name         | Value             |
    |--------------|-------------------|
    | MNEMONIC1    | Mainnet mnemonic  |
    | MNEMONIC3    | Ropsten mnemonic  |
    | MNEMONIC4    | Rinkeby mnemonic  |
    | MNEMONIC42   | Kovan mnemonic    |
    | INFURA_KEY   | Infura access key |
    | ETHERSCAN_KEY| Etherscan API key |

Note:  
Read [How do I set an environment variable?](https://www.schrodinger.com/kb/1842) article for more info on how to
set up environment variables in Linux, Windows and macOS.

### Example Script: macOS Catalina ###
```
export MNEMONIC1="witch collapse practice feed shame open despair creek road again ice least"
export MNEMONIC3="someone relief rubber remove donkey jazz segment nose spray century put beach"
export MNEMONIC4="someone relief rubber remove donkey jazz segment nose spray century put beach"
export MNEMONIC42="someone relief rubber remove donkey jazz segment nose spray century put beach"
export INFURA_KEY="000ba27dfb1b3663aadfc74c3ab092ae"
export ETHERSCAN_KEY="9GEEN6VPKUR7O6ZFBJEKCWSK49YGMPUBBG"
```

## Compilation ##
Execute ```npx hardhat compile``` command to compile smart contracts.

Compilation settings are defined in [hardhat.config.js](./hardhat.config.js) ```solidity``` section.

Note: Solidity files *.sol use strict compiler version, you need to change all the headers when upgrading the
compiler to another version 

## Testing ##
Smart contract tests are built with Truffle – in JavaScript (ES6) and [web3.js](https://web3js.readthedocs.io/)

The tests are located in [test](./test) folder. 
They can be run with built-in [Hardhat Network](https://hardhat.org/hardhat-network/).

Run ```npx hardhat test``` to run all the tests or ```.npx hardhat test <test_file>``` to run individual test file.
Example: ```npx hardhat test ./test/intelli_token_proto.js```

## Deployment ##
Deployments are implemented as [hardhat scripts](https://hardhat.org/guides/deploying.html), without migrations.

Deployment scripts perform smart contracts deployment itself and their setup configuration.
Executing a script may require several transactions to complete, which may fail. To help troubleshoot
partially finished deployment, the scripts are designed to be rerunnable and execute only the transactions
which were not executed in previous run(s).

Deployment scripts are located under [scripts](./scripts) folder.

To run fresh deployment:

1. Open [scripts/config.js](./scripts/config.js)

2. For the network of interest (where the deployment is going to happen to) locate the deployed instances address(es) and
erase them. For example, if we are to deploy all the contracts into the Rinkeby network:
    ```
    ...

		// Rinkeby Configuration
		case "rinkeby":
			return {
				// NFTMock is an arbitrary ERC721 token deployed
				NFTMock: "",
				// AI Pod ERC721 Version 1
				AiPodERC721v1: "",
				// Intelligent NFT (iNFT) Version 1
				IntelligentNFTv1: "",
			};

    ...
    ```

3. Run the deployment script of interest with the ```npx hardhat run``` command
    ```
    npx hardhat run --network rinkeby ./scripts/v1_deploy.js
    ```
where ```./scripts/v1_deploy.js``` specifies the deployment script,
and ```--network rinkeby``` specifies the network to run script for
(see [hardhat.config.js](./hardhat.config.js) for network definitions). 

To rerun the deployment script and continue partially completed script:

1. Open [scripts/config.js](./scripts/config.js)

2. For the network of interest locate the deployed instances address(es) and fill with the correct (previously deployed)
values. For example, if we already deployed some contracts into Rinkeby network, but are missing other contracts:
    ```
    ...

		// Rinkeby Configuration
		case "rinkeby":
			return {
				// NFTMock is an arbitrary ERC721 token deployed
				NFTMock: "0xA66e81eAa45F98D913CdAEc8FBE5c746769f58c7",
				// AI Pod ERC721 Version 1
				AiPodERC721v1: "0x205b3c69C9Bbd5E0F65249a9785F36aF28ac9aAa",
				// Intelligent NFT (iNFT) Version 1
				IntelligentNFTv1: "",
			};

    ...
    ```

3. Run the deployment script with the ```npx hardhat run``` command, for example:
    ```
    npx hardhat run --network rinkeby ./scripts/v1_deploy.js
    ```


(c) 2021 [Alethea AI](https://Alethea.ai/)
