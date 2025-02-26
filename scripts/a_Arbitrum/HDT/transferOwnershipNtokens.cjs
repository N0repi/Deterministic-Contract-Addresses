require("dotenv").config();
const hre = require("hardhat");
const ethers = hre.ethers;

const TARGET_WALLET = "0x951204CB69C2e24572FeB727f9fCD837404eBf70";
const TOKEN_ADDRESS = "0xBabe338052d822233Df0CD27Be40d6209B86Bae7"; // HumbleDonationsToken
const SIMPLE_DEPLOYER_ADDRESS = "0x6a45Ca6f11E6C18215e81ae1741A9E5c60b53104";

async function main() {
  const simpleDeployer = await ethers.getContractAt(
    "SimpleDeployer",
    SIMPLE_DEPLOYER_ADDRESS
  );

  // Transfer all tokens from SimpleDeployer to TARGET_WALLET
  console.log(
    `Transferring all tokens from SimpleDeployer to ${TARGET_WALLET}...`
  );
  const transferTx = await simpleDeployer.transferAllTokens(TOKEN_ADDRESS);
  await transferTx.wait();
  console.log("Tokens successfully transferred.");

  // Transfer ownership of HumbleDonationsToken to TARGET_WALLET
  console.log(
    `Transferring ownership of HumbleDonationsToken to ${TARGET_WALLET}...`
  );
  const ownershipTx = await simpleDeployer.transferTokenOwnership(
    TOKEN_ADDRESS
  );
  await ownershipTx.wait();
  console.log("Ownership successfully transferred.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });
