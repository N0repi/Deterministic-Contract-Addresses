const ethers = require("ethers");
const rlp = require("rlp");

const deployerAddress = "0x951204CB69C2e24572FeB727f9fCD837404eBf70"; // Replace with your deployer address
const targetNonce = 2; // Replace with the nonce you want to verify

const encoded = rlp.encode([deployerAddress, targetNonce]);
const computedAddress = "0x" + ethers.keccak256(encoded).slice(-40);

console.log(`Computed Address for nonce ${targetNonce}: ${computedAddress}`);
