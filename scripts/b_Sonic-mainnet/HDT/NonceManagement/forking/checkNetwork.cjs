const hre = require("hardhat");
const ethers = hre.ethers;


// Check the current block number (should match Sonic Mainnet)
const blockNumber = await ethers.provider.getBlockNumber();
console.log(`Current Block Number: ${blockNumber}`);

// Confirm the network chain ID (should match Sonic Mainnet's chain ID, 146)
const network = await ethers.provider.getNetwork();
console.log(`Forked Network: Chain ID ${network.chainId}`);
