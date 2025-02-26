// ownerOfHDT.cjs

require("dotenv").config();
const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {
  const govToken = await ethers.getContractAt(
    "HumbleDonationsToken",
    "0xBabe338052d822233Df0CD27Be40d6209B86Bae7"
  );
  const currentOwner = await govToken.owner();
  console.log(`Current owner of HumbleDonationsToken: ${currentOwner}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });

//   Current owner of HumbleDonationsToken: 0x951204CB69C2e24572FeB727f9fCD837404eBf70
