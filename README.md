# Deterministic Contract Address

I created this environment months ago to prepare for pushing a crosschain project into production. The contract, SimpleDeployer.sol, inputs a salt and contract bytecode to determine to predict the address of a contract. The bytecode can be fetched from the contract abi in `./artifacts`.

A simple example of this usecase is in `scripts/a_Arbitrum/HDT/deployTokenSaltBruteLocalOptimized.cjs`. The script allows for the user to define a hexadecimal phrase for the beginning of the desired address (eg. 0xFade), the script then "searches" for a desired contract adddress and will return the salt. The salt can then be used to deploy the contract at the desired address, shown in `scripts/a_Arbitrum/HDT/deployTokenSalt.cjs`.

In the folder `scripts/b_Sonic-mainnet`, there are methods to match an existing deployed address to a new contract on a different network. I used this to reserve the same contract addresses for my contracts on both Arbitrum and Sonic.

The scripts can be further optimized by using GPU acceleration and parallel processing when locating a desired address.

## Real usecase

I have the following contracts deployed

### Arbitrum One

- **Humble Donations Token**: [0xBabe35F94fE6076474F65771Df60d99cb097323A](https://arbiscan.io/address/0xBabe35F94fE6076474F65771Df60d99cb097323A)

- **Humble Donations**: [0xEcD2932aA582b4b669845c96B64c3e95156ec425](https://arbiscan.io/address/0xEcD2932aA582b4b669845c96B64c3e95156ec425)

### Sonic

- **Humble Donations Token**: [0xBabe35F94fE6076474F65771Df60d99cb097323A](https://sonicscan.org/address/0xBabe35F94fE6076474F65771Df60d99cb097323A)

- **Humble Donations**: [0xEcD2932aA582b4b669845c96B64c3e95156ec425](https://sonicscan.org/address/0xEcD2932aA582b4b669845c96B64c3e95156ec425/#code)
