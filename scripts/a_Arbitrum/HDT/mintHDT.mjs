// mintHDT.mjs

/*
Test minting HDT to see if the require statement for maxSupply works
*/
import dotenv from "dotenv";
dotenv.config();
import { ethers } from "ethers";
const MY_ADDRESS = process.env.MY_ADDRESS;

import HumbleDonationsToken from "../../../artifacts/contracts/HDT/HumbleDonationsToken.sol/HumbleDonationsToken.json" assert { type: "json" };

async function main() {
  // Grab the contract factory

  const { abi } = HumbleDonationsToken;
  const API_URL = process.env.API_URL_SEPOLIA;
  const WALLET_ADDRESS = process.env.MY_ADDRESS;
  console.log("Wallet address:", WALLET_ADDRESS);
  const WALLET_SECRET = process.env.PRIVATE_KEY;
  const provider = new ethers.JsonRpcProvider(API_URL);
  const signer = new ethers.Wallet(WALLET_SECRET, provider);

  const contractAddress = "0x357BF1668699a153b32Ec46366e34c737E74F8c4";

  const contractInstance = new ethers.Contract(contractAddress, abi, signer);
  // const initialOwner = await GovToken.(MY_ADDRESS);
  const gasLimit = 10000000;

  const amount = ethers.parseEther("5");

  // Start deployment, returning a promise that resolves to a contract object
  const govToken = await contractInstance.mint(MY_ADDRESS, amount, {
    gasLimit: gasLimit,
  }); // Instance of the contract
  // await govToken;
  const awaitTx = await govToken;

  // const paymentReceipt = await nOC19SepoliaUUPS.wait();
  // console.log("Transaction Receipt:", paymentReceipt)

  console.log(`https://sepolia.etherscan.io/tx/${awaitTx.hash}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
