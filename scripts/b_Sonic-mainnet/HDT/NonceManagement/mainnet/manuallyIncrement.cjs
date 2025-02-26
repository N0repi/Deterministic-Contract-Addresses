const hre = require("hardhat");
const ethers = hre.ethers;

async function incrementNonce() {
  const WALLET_SECRET = process.env.ARBITRUM_PRIVATE_KEY;
  const provider = new ethers.JsonRpcProvider("https://rpc.soniclabs.com");
  const wallet = new ethers.Wallet(WALLET_SECRET, provider);

  console.log(`Deployer Address: ${wallet.address}`);

  const currentNonce = await provider.getTransactionCount(wallet.address);
  const targetNonce = 2; // Replace with the desired nonce
  console.log(`Current Nonce: ${currentNonce}`);

  if (currentNonce >= targetNonce) {
    console.log(
      `Nonce is already at or above ${targetNonce}. No action needed.`
    );
    return;
  }

  console.log(`Incrementing nonce to ${targetNonce}...`);

  for (let i = currentNonce; i < targetNonce; i++) {
    const tx = await wallet.sendTransaction(
      {
        to: wallet.address, // Send to self
        value: ethers.parseEther("0"), // 0 ETH to increment nonce
      },
      { gasLimit: 10000000 }
    );
    await tx.wait();
    console.log(
      `Incremented nonce to: ${await provider.getTransactionCount(
        wallet.address
      )}`
    );
  }

  console.log(
    `Nonce incremented to target value: ${await provider.getTransactionCount(
      wallet.address
    )}`
  );
}

incrementNonce()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
