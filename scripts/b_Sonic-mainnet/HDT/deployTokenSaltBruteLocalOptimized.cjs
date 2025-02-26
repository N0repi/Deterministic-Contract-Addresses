require("dotenv").config();
const hre = require("hardhat");
const ethers = hre.ethers;
const MY_ADDRESS = process.env.ARBITRUM_MY_ADDRESS;
/* 
Found matching address: 0xBabe338052d822233Df0CD27Be40d6209B86Bae7
Using salt: 0x00000000000000000000000000000000000000000000000000000000002f79c7
*/
async function main() {
  const simpleDeployerAddress = "0x213804f5554f32C65d7424EcF2269354b8E974BD"; // Deployed SimpleDeployer contract address
  const targetAddress = "0xBabe35F94fE6076474F65771Df60d99cb097323A"; // Full target address
  const maxAttempts = 1000000000000;

  // Get contract factory and encode constructor arguments
  const GovToken = await hre.ethers.getContractFactory("HumbleDonationsToken");
  const bytecode = ethers.concat([
    GovToken.bytecode,
    GovToken.interface.encodeDeploy([MY_ADDRESS]),
  ]);

  // Precompute the bytecode hash once
  const bytecodeHash = ethers.keccak256(bytecode);

  console.log("Searching for a suitable salt...");

  let salt;
  let deploymentAddress;

  for (let i = 1; i < maxAttempts; i++) {
    // Generate a new salt using a buffer for efficiency
    const saltBuffer = Buffer.alloc(32);
    saltBuffer.writeUInt32BE(i, 28); // Write 'i' into the last 4 bytes of the buffer
    salt = "0x" + saltBuffer.toString("hex");

    // Compute the deployment address locally
    deploymentAddress = ethers.getCreate2Address(
      simpleDeployerAddress,
      salt,
      bytecodeHash
    );

    // Check if the address matches the full target address
    if (deploymentAddress.toLowerCase() === targetAddress.toLowerCase()) {
      console.log(`Found matching address: ${deploymentAddress}`);
      console.log(`Using salt: ${salt}`);
      break;
    }

    // If we reach max attempts, log a message
    if (i === maxAttempts - 1) {
      console.log(
        `Failed to find the target address "${targetAddress}" after ${maxAttempts} attempts.`
      );
      return;
    }
  }

  // You can deploy the contract if the matching salt is found
  console.log("Matching salt found, ready to deploy.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });
