const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {
  // Load your deployer wallet
  const WALLET_SECRET = process.env.ARBITRUM_PRIVATE_KEY;
  const provider = new ethers.JsonRpcProvider("https://rpc.soniclabs.com");
  const wallet = new ethers.Wallet(WALLET_SECRET, provider);

  console.log(`Deployer Address: ${wallet.address}`);

  // Verify the nonce
  const currentNonce = await provider.getTransactionCount(wallet.address);
  const targetNonce = 2; // Replace with your desired nonce
  const targetAddress = "0x6a45Ca6f11E6C18215e81Ae1741A9E5c60b53104"; // Replace with your desired address
  console.log(`Current Nonce: ${currentNonce}`);

  if (currentNonce !== targetNonce) {
    console.error(
      `Nonce mismatch! Current nonce is ${currentNonce}, but expected ${targetNonce}. Ensure the nonce is correct.`
    );
    process.exit(1);
  }

  // Deploy the contract
  const ContractFactory = await hre.ethers.getContractFactory("SimpleDeployer");
  const contract = await ContractFactory.connect(wallet).deploy();
  await contract.waitForDeployment();

  const deploymentAddress = await contract.getAddress();
  console.log(`SimpleDeployer deployed at: ${deploymentAddress}`);

  // Verify the deployed address
  if (deploymentAddress.toLowerCase() === targetAddress.toLowerCase()) {
    console.log(
      `Success! Contract deployed at the desired address: ${targetAddress}`
    );
  } else {
    console.error(
      `Mismatch! Expected address: ${targetAddress}, but deployed at: ${deploymentAddress}`
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
