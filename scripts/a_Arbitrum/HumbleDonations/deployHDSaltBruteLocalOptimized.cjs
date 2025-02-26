// deployHDSaltBruteLocalOptimized.cjs --> HumbleDonations.sol

require("dotenv").config();
const hre = require("hardhat");
const ethers = hre.ethers;
const MY_ADDRESS = process.env.ARBITRUM_MY_ADDRESS_DEPLOYER;

/* 
Found matching address: 0xBabe84c5969dD64157c250D8Ea7e5893eD4336DE
Using salt: 0x000000000000000000000000000000000000000000000000000000000001a424
*/
async function main() {
  const simpleDeployerAddress = "0x6a45Ca6f11E6C18215e81ae1741A9E5c60b53104"; // Deployed SimpleDeployer contract address
  const desiredPrefix = "0xBabe"; // Target prefix to search for at the beginning of the address
  const maxAttempts = 1000000000;

  // Get contract factory and encode constructor arguments
  const DonationsContract = await hre.ethers.getContractFactory(
    "HumbleDonations"
  );
  const bytecode = ethers.concat([
    DonationsContract.bytecode,
    DonationsContract.interface.encodeFunctionData("initialize", [MY_ADDRESS]),
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

    // Check if the address starts with the exact desired prefix "0xBabe"
    if (deploymentAddress.startsWith(desiredPrefix)) {
      console.log(`Found matching address: ${deploymentAddress}`);
      console.log(`Using salt: ${salt}`);
      break;
    }

    // If we reach max attempts, log a message
    if (i === maxAttempts - 1) {
      console.log(
        `Failed to find an address starting with "${desiredPrefix}" after ${maxAttempts} attempts.`
      );
      return;
    }
  }

  //   Deploy the contract using the found salt

  //   try {
  //     console.log("Deploying with CREATE2...");
  //     const simpleDeployer = await ethers.getContractAt(
  //       "SimpleDeployer",
  //       simpleDeployerAddress
  //     );

  //     const tx = await simpleDeployer.deploy(0, salt, bytecode, {
  //       gasLimit: 300000,
  //     });
  //     await tx.wait();
  //     console.log(
  //       `Token deployed at deterministic address: https://arbiscan.io/address/${deploymentAddress}`
  //     );
  //   } catch (error) {
  //     console.error("Deployment failed:", error);
  //   }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });
