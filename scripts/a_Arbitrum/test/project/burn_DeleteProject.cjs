// burn_DeleteProject.js;

const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0xEcD2932aA582b4b669845c96B64c3e95156ec425";

  const HumbleDonations = await hre.ethers.getContractAt(
    "HumbleDonations",
    contractAddress
  );

  /*
  There is no get-hook in the contract which returns the tokenId of a project.
  In the frontend, this is handled by The Graph indexing the emitted event at the end of `safeMint`
  */
  const tokenId = "1";

  const burnTokenTx = await HumbleDonations.burnToken(tokenId);

  console.log(`Transaction Hash: https://arbiscan.io/tx/${burnTokenTx.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
