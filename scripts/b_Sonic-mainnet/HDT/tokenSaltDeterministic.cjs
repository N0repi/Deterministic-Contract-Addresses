require("dotenv").config();
const hre = require("hardhat");
const ethers = hre.ethers;

/*
Stop Log:
12/29/24

Stopped at Checked 216000000 salts...
*/

async function main() {
  const simpleDeployerAddress = "0x213804f5554f32C65d7424EcF2269354b8E974BD"; // Deployer address
  const targetAddress = "0xBabe35F94fE6076474F65771Df60d99cb097323A"; // Desired address

  // Get the contract factory and prepare bytecode with constructor arguments
  const GovToken = await hre.ethers.getContractFactory("HumbleDonationsToken");
  const bytecode = ethers.concat([
    GovToken.bytecode,
    GovToken.interface.encodeDeploy([process.env.ARBITRUM_MY_ADDRESS]),
  ]);

  // Precompute the bytecode hash
  const bytecodeHash = ethers.keccak256(bytecode);
  console.log(`Bytecode Hash: ${bytecodeHash}`);

  // Define salt space and initialize variables
  const saltSpace = BigInt(2) ** BigInt(32); // Testing 32-bit salt space for practicality
  let foundSalt = null;

  console.log("Searching for matching salt...");

  for (let i = BigInt(171000000); i < saltSpace; i++) {
    // Generate a 32-byte padded salt
    const salt = ethers.zeroPadValue(ethers.toBeHex(i), 32);

    // Compute deterministic address using ethers.getCreate2Address
    const computedAddress = ethers.getCreate2Address(
      simpleDeployerAddress,
      salt,
      bytecodeHash
    );

    // Check if the computed address matches the target address
    if (computedAddress.toLowerCase() === targetAddress.toLowerCase()) {
      foundSalt = salt;
      console.log(`Matching salt found: ${salt}`);
      console.log(`Computed Address: ${computedAddress}`);
      break;
    }

    // Log progress every 1,000,000 iterations
    if (i % BigInt(1_000_000) === BigInt(0)) {
      console.log(`Checked ${i} salts...`);
    }
  }

  if (!foundSalt) {
    console.log("No matching salt found.");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });
