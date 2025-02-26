require("dotenv").config();
const hre = require("hardhat");
const ethers = hre.ethers;
const MY_ADDRESS = process.env.ARBITRUM_MY_ADDRESS;

/*
---Salt info---
Found matching address: 0xFade011AaDCC05b373C2A679E73980d12095A1fc
Using salt: 0x00000000000000000000000000000000000000000000000000000000001241a6
---Salt info---
Deployed [x]
*/

async function main() {
  const simpleDeployerAddress = "0x6a45Ca6f11E6C18215e81ae1741A9E5c60b53104";
  const salt =
    "0x00000000000000000000000000000000000000000000000000000000001241a6";

  // Get contract factory and encode constructor arguments if necessary
  const GovToken = await hre.ethers.getContractFactory("TokenListMulticall");
  const bytecode = ethers.concat([GovToken.bytecode]);

  // Connect to the SimpleDeployer
  const simpleDeployer = await ethers.getContractAt(
    "SimpleDeployer",
    simpleDeployerAddress
  );

  console.log("Deploying with CREATE2...");

  try {
    // Compute the deployment address
    const bytecodeHash = ethers.keccak256(bytecode);
    const deploymentAddress = await simpleDeployer.computeAddress(
      salt,
      bytecodeHash
    );
    console.log(
      `Predicted deployment address: https://arbiscan.io/address/${deploymentAddress}`
    );

    // Deploy the contract
    const tx = await simpleDeployer.deploy(0, salt, bytecode, {
      gasLimit: 10000000,
    });
    await tx.wait();

    console.log(
      `Token deployed at deterministic address: https://arbiscan.io/address/${deploymentAddress}`
    );
  } catch (error) {
    console.error("Deployment failed:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });
