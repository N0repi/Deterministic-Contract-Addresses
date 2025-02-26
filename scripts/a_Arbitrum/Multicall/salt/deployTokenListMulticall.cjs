// deployTokenListMulticall

// Sepolia address: 0x9391CBb694c96Ce68c5b6659d3Fff811F9EbA7dB

require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  // We get the contract to deploy
  const TokenListMulticall = await ethers.getContractFactory(
    "TokenListMulticall"
  );

  // Define initial parameters for the TokenListMulticall token deployment

  console.log("Deploying TokenListMulticall contract...");

  // Deploy the contract with initial supply, name, symbol, and decimals
  const tokenListMulticall = await TokenListMulticall.deploy();

  await tokenListMulticall.waitForDeployment();

  const deploymentAddress = await tokenListMulticall.getAddress();
  console.log(`Deployment Address:  ${deploymentAddress}`);
  console.log(
    `TokenListMulticall deployed to https://arbiscan.io/address/${deploymentAddress}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
