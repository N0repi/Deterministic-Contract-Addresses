// computeBytecodeHash.mjs

import { ethers } from "ethers";
import simpleDeployerABI from "../../../artifacts/contracts/salt/SimpleDeployer.sol/SimpleDeployer.json" assert { type: "json" };
import dotenv from "dotenv";
dotenv.config();

const API_URL = process.env.SONIC_API_URL;
const WALLET_ADDRESS = process.env.ARBITRUM_MY_ADDRESS;
console.log("Wallet address:", WALLET_ADDRESS);
const WALLET_SECRET = process.env.ARBITRUM_PRIVATE_KEY;
const provider = new ethers.JsonRpcProvider(API_URL);
const signer = new ethers.Wallet(WALLET_SECRET, provider);

async function computeBytecode() {
  const address = "0x213804f5554f32C65d7424EcF2269354b8E974BD";
  const abi = simpleDeployerABI.abi;

  const simpleDeployer = new ethers.Contract(address, abi, provider);
  const testAddress = await simpleDeployer.computeAddress(salt, bytecodeHash);
  console.log(`Computed address on-chain: ${testAddress}`);
  const bytecodeHash =
    "0xb86c58704a5200d589d34ad54cdd54aabb4ef87c596b1f91c6ebc1b7bd750da0";
}

computeBytecode();
