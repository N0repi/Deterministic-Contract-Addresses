const ethers = require("ethers");
const rlp = require("rlp");

async function findNonce(deployerAddress, targetAddress, maxAttempts = 1000) {
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545"); // Local Hardhat fork
  const currentNonce = await provider.getTransactionCount(deployerAddress);
  console.log(`Current Nonce: ${currentNonce}`);

  for (let nonce = currentNonce; nonce < currentNonce + maxAttempts; nonce++) {
    const encoded = rlp.encode([deployerAddress, nonce]);
    const computedAddress = "0x" + ethers.keccak256(encoded).slice(-40);

    console.log(`Nonce: ${nonce}, Computed Address: ${computedAddress}`);

    if (computedAddress.toLowerCase() === targetAddress.toLowerCase()) {
      console.log(`Found matching nonce: ${nonce}`);
      return nonce;
    }
  }

  console.error(`No matching nonce found within ${maxAttempts} attempts.`);
  return null;
}

async function main() {
  const deployerAddress = "0x951204CB69C2e24572FeB727f9fCD837404eBf70"; // Replace with your deployer address
  const targetAddress = "0x6a45Ca6f11E6C18215e81ae1741A9E5c60b53104"; // Replace with your target address

  const nonce = await findNonce(deployerAddress, targetAddress);

  if (nonce !== null) {
    console.log(`Use nonce: ${nonce} to deploy your contract.`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
