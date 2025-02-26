// mint_CreateProject_node.js

import dotenv from "dotenv";
dotenv.config();
import HumbleDonations from "../../../../artifacts/contracts/HumbleDonations.sol/HumbleDonations.json" assert { type: "json" };
import { ethers } from "ethers";

const contractAddress = "0xEcD2932aA582b4b669845c96B64c3e95156ec425";

const recieverAddress = "0x6B1B8F33D29A1c2389a5d47F05d29089968bcc38";

const API_URL = process.env.ARBITRUM_URL;
const WALLET_ADDRESS = process.env.ARBITRUM_PROJECT_ADDRESS;
console.log("Wallet address:", WALLET_ADDRESS);
const WALLET_SECRET = process.env.ARBITRUM_PROJECT_KEY;
const provider = new ethers.JsonRpcProvider(API_URL);
const signer = new ethers.Wallet(WALLET_SECRET, provider);

const { abi } = HumbleDonations;

const contract = new ethers.Contract(contractAddress, abi, signer);

async function main() {
  const read_mintRate = await contract.get_mintRate();
  const uri = ""; /*
  This is frontend logic that isn't important to the contract. 
  Regardless of what you pass as `uri`, the minted tokenId can be viewed from the frontend https://www.humbledonations.com/donate
  if minted with contradAddress "0x977428b2547A247848E2DD736B760c80da192b06"

  Essentially, formatting the uri as a JSON with the following fields will create a dynamic route on the frontend. 
  An example uri below:
  {"title":"Example Title","body":"Example Description","tag":["DeFi"],"website":"https://humbledonations.com","twitter":"","discord":"","youtube":"","twitch":"","reel":"","github":"N0repi"}

  Is being rendered on https://www.humbledonations.com/projects/Example%20Title
  */
  const projectTitle = "ArbitrumOneTest"; // any name that has not been previously used will suffice

  const mintTokens = await contract.safeMint(
    recieverAddress,
    uri,
    projectTitle,
    {
      value: read_mintRate,
      // gasLimit: 1000000,
    }
  );

  console.log(`Transaction Hash: https://arbiscan.io/tx/${mintTokens.hash}`);
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
