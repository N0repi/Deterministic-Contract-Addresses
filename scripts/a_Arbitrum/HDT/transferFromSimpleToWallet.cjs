require("dotenv").config();
const hre = require("hardhat");
const ethers = hre.ethers;
const MY_ADDRESS = process.env.ARBITRUM_MY_ADDRESS; // Your Arbitrum wallet address
const TOKEN_ADDRESS = "0xBabe77350b130C99233d37EDD6327a3d3e7Ab6E1"; // Address of HumbleDonationsToken
const SIMPLE_DEPLOYER_ADDRESS = "0x213804f5554f32C65d7424EcF2269354b8E974BD"; // Address of SimpleDeployer

async function main() {
  // Get a signer for SimpleDeployer
  const simpleDeployerSigner = await hre.ethers.getSigner(
    SIMPLE_DEPLOYER_ADDRESS
  );

  // Connect to the HumbleDonationsToken contract
  const govToken = await hre.ethers.getContractAt(
    "HumbleDonationsToken",
    TOKEN_ADDRESS,
    simpleDeployerSigner // Use SimpleDeployer as the signer
  );

  // Define the amount to transfer (e.g., all tokens)
  const balance = await govToken.balanceOf(SIMPLE_DEPLOYER_ADDRESS);

  console.log(
    `Transferring ${balance.toString()} tokens from SimpleDeployer to your wallet...`
  );

  // Transfer tokens
  const tx = await govToken.transfer(MY_ADDRESS, balance);
  await tx.wait();

  console.log(`Tokens successfully transferred to ${MY_ADDRESS}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });
