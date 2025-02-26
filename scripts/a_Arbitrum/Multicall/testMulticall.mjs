// testMulticall.mjs

import { ethers } from "ethers";
import TokenListMulticall from "../../../artifacts/contracts/TokenListMulticall.sol/TokenListMulticall.json" assert { type: "json" };
import tokenList from "./filteredTokenList.json" assert { type: "json" };

const MULTICALL_ADDRESS = "0x9391CBb694c96Ce68c5b6659d3Fff811F9EbA7dB"; // Replace with deployed Multicall contract address
const ABI = TokenListMulticall.abi;

const TARGET_CHAIN_ID = 11155111; // Replace with the chain ID you are querying
const userAddress = "0xf7ABBCaa52e051d10215414Dd694451Af4bF9111"; // Replace with the user's wallet address

async function fetchBalances(provider) {
  const multicall = new ethers.Contract(MULTICALL_ADDRESS, ABI, provider);

  const balanceOfAbi = [
    "function balanceOf(address account) view returns (uint256)",
  ];
  const iface = new ethers.Interface(balanceOfAbi);

  // Filter tokens based on the target chain and resolve addresses from `extensions.bridgeInfo` if available
  const tokens = tokenList.myTokenList
    .filter((token) => {
      // Include tokens with native addresses or bridgeInfo for the target chain
      return (
        token.chainId === TARGET_CHAIN_ID ||
        token.extensions?.bridgeInfo?.[TARGET_CHAIN_ID]
      );
    })
    .map((token) => {
      // Resolve the correct address for the token
      const resolvedAddress =
        token.extensions?.bridgeInfo?.[TARGET_CHAIN_ID]?.tokenAddress ||
        token.address;
      return { ...token, address: resolvedAddress };
    });

  console.log(`Filtered Tokens for Chain ${TARGET_CHAIN_ID}:`, tokens);

  // Separate the native token (empty address) for direct balance query
  const nativeToken = tokens.find((token) => token.address === "");
  const erc20Tokens = tokens.filter((token) => token.address !== "");

  // Prepare calls for ERC-20 tokens
  const calls = erc20Tokens.map((token) => ({
    target: token.address,
    callData: iface.encodeFunctionData("balanceOf", [userAddress]),
  }));

  try {
    // Get ERC-20 token balances using Multicall
    const { returnData } = await multicall.aggregate(calls);

    const erc20Balances = returnData.map((data, index) => {
      if (data === "0x") {
        console.warn(`Token ${erc20Tokens[index].symbol} returned empty data`);
        return {
          ...erc20Tokens[index],
          balance: "0", // Default to 0 for failed calls
        };
      }
      const balance = ethers.getBigInt(data);
      return {
        ...erc20Tokens[index],
        balance: ethers.formatUnits(balance, erc20Tokens[index].decimals),
      };
    });

    // Fetch native currency balance
    let nativeBalance = null;
    if (nativeToken) {
      const balance = await provider.getBalance(userAddress);
      nativeBalance = {
        ...nativeToken,
        balance: ethers.formatUnits(balance, nativeToken.decimals),
      };
    }

    // Combine ERC-20 and native balances
    const balances = nativeBalance
      ? [nativeBalance, ...erc20Balances]
      : erc20Balances;

    console.log("Balances:", balances);
    return balances;
  } catch (error) {
    console.error("Error fetching balances:", error);
  }
}

// Example usage
const provider = new ethers.JsonRpcProvider(
  "https://eth-sepolia.g.alchemy.com/v2/Illl_L5_H-h0oDo0uIEtYJK_jyhv1hgW" // Replace with your RPC URL for Arbitrum One
);
fetchBalances(provider);
