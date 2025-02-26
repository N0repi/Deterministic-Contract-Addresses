require("dotenv").config();
const hre = require("hardhat");

async function main() {
  console.log("Starting deployment script...");

  const SimpleDeployer = await hre.ethers.getContractFactory("SimpleDeployer");
  console.log("Contract factory created.");

  const simpleDeployer = await SimpleDeployer.deploy();
  console.log("Deployment transaction sent, waiting for confirmation...");

  // Catch any deployment errors
  try {
    await simpleDeployer.waitForDeployment();
    console.log("Contract deployed.");
  } catch (error) {
    console.error("Deployment failed during wait:", error);
    process.exit(1);
  }

  const deploymentAddress = await simpleDeployer.getAddress();
  console.log(`Deployed contract address: ${deploymentAddress}`);

  console.log(
    `SimpleDeployer deployed at: https://sonicscan.org/address/${deploymentAddress}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });
