// mint_CreateProject.js

const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0xEcD2932aA582b4b669845c96B64c3e95156ec425";

  const recieverAddress = "0x6B1B8F33D29A1c2389a5d47F05d29089968bcc38";

  const HumbleDonations = await hre.ethers.getContractAt(
    "HumbleDonations",
    contractAddress
  );

  const read_mintRate = await HumbleDonations.get_mintRate();
  const uri = ""; /*
  This is frontend logic that isn't important to the contract. 
  Regardless of what you pass as `uri`, the minted tokenId can be viewed from the frontend https://www.humbledonations.com/donate
  if minted with contradAddress "0x977428b2547A247848E2DD736B760c80da192b06"

  Essentially, formatting the uri as a JSON with the following fields will create a dynamic route on the frontend. 
  An example uri below:
  {"title":"Example Title","body":"Example Description","tag":["DeFi"],"website":"https://humbledonations.com","twitter":"","discord":"","youtube":"","twitch":"","reel":"","github":"N0repi"}

  Is being rendered on https://www.humbledonations.com/projects/Example%20Title
  */
  const projectTitle = "projectTestID1"; // any name that has not been previously used will suffice

  const mintTokens = await HumbleDonations.safeMint(
    recieverAddress,
    uri,
    projectTitle,
    {
      value: read_mintRate,
    }
  );

  console.log(
    //`Transaction Hash: https://sepolia.etherscan.io/tx/${mintTokens.hash}`,
    `Transaction Hash: https://scan.soniclabs.com/tx/${mintTokens.hash}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// await humbleDonations.waitForDeployment();

// const deploymentAddress = await humbleDonations.getAddress();

// console.log(
//   `Deployed to https://sepolia.etherscan.io/address/${deploymentAddress}`
// );
// }
