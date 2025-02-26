require("dotenv").config();
const { ethers } = require("hardhat");

const {
  abi: INonfungiblePositionManagerABI,
} = require("@uniswap/v3-periphery/artifacts/contracts/interfaces/INonfungiblePositionManager.sol/INonfungiblePositionManager.json");
const {
  abi: NonfungiblePositionManagerABI,
} = require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json");

async function getCirculatingSupply() {
  const API_URL = process.env.ARBITRUM_URL;
  const provider = new ethers.JsonRpcProvider(API_URL);

  const HDT = await ethers.getContractFactory("HumbleDonationsToken");

  const nonfungiblePositionManager = new ethers.Contract(
    "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
    NonfungiblePositionManagerABI,
    provider
  );

  // const totalSupply = await HDT.totalSupply();

  // Hardcoded total supply for now (ensure it's a BigInt if using hardcoded values)
  const totalSupply = BigInt("100000000000000000000000000"); // 100 million HDT with 18 decimals  |  hardcoded 100000000  | crm mm 99988916.56698

  // Replace this with the actual team reserves (as a BigInt)
  const teamReserves = BigInt("0");

  // Fetch HDT in Uniswap V3 positions
  const positionIds = [3850323, 3910509]; // Replace with your position IDs
  let totalHDTLocked = BigInt(0);

  for (const positionId of positionIds) {
    const position = await nonfungiblePositionManager.positions(positionId);

    // Adjust based on whether HDT is token0 or token1
    const hdtLocked = BigInt(position.tokensOwed0); // Replace with tokensOwed1 if HDT is token1

    totalHDTLocked += hdtLocked;
  }

  // Calculate circulating supply
  const circulatingSupply = totalSupply - totalHDTLocked - teamReserves;

  console.log(`Circulating Supply: ${circulatingSupply.toString()}`);
  return circulatingSupply;
}

getCirculatingSupply()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
