const hre = require("hardhat");
const ethers = hre.ethers;

async function incrementNonce() {
  const deployerAddress = "0x951204CB69C2e24572FeB727f9fCD837404eBf70";

  // Impersonate the deployer
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [deployerAddress],
  });
  const impersonatedSigner = await ethers.getSigner(deployerAddress);

  // Fund the deployer if needed
  const [fundingAccount] = await ethers.getSigners();
  await fundingAccount.sendTransaction({
    to: deployerAddress,
    value: ethers.parseEther("1"),
  });

  console.log(`Funding complete for ${deployerAddress}.`);

  // Send a dummy transaction to increment the nonce
  const tx = await impersonatedSigner.sendTransaction({
    to: deployerAddress, // Self-transfer
    value: ethers.parseEther("0"),
  });
  await tx.wait();

  console.log(
    `Nonce incremented. New Nonce: ${await ethers.provider.getTransactionCount(
      deployerAddress
    )}`
  );
}

incrementNonce()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
