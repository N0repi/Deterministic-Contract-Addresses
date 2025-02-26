const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {
  const deployerAddress = "0x951204CB69C2e24572FeB727f9fCD837404eBf70"; // Replace with your deployer address
  const targetNonce = 2; // Replace with the desired nonce for deployment
  const targetAddress = "0x6a45Ca6f11E6C18215e81ae1741A9E5c60b53104";

  // Impersonate the deployer address
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [deployerAddress],
  });
  const impersonatedSigner = await ethers.getSigner(deployerAddress);

  // Fund the impersonated account
  const [fundingAccount] = await ethers.getSigners();
  await fundingAccount.sendTransaction({
    to: deployerAddress,
    value: ethers.parseEther("100"),
  });

  console.log(`${deployerAddress} impersonated and funded.`);

  // Get the current nonce
  const currentNonce = await ethers.provider.getTransactionCount(
    deployerAddress
  );
  console.log(`Current Nonce for ${deployerAddress}: ${currentNonce}`);

  // Increment the nonce if necessary
  if (currentNonce < targetNonce) {
    for (let i = currentNonce; i < targetNonce; i++) {
      const tx = await impersonatedSigner.sendTransaction({
        to: deployerAddress,
        value: ethers.parseEther("0"), // Send 0 ETH to self
      });
      await tx.wait();
      console.log(
        `Incremented nonce to: ${await ethers.provider.getTransactionCount(
          deployerAddress
        )}`
      );
    }
  } else if (currentNonce > targetNonce) {
    console.error(
      `Current nonce (${currentNonce}) exceeds the target nonce (${targetNonce}).`
    );
    process.exit(1);
  }

  console.log(
    `Nonce is now set to ${await ethers.provider.getTransactionCount(
      deployerAddress
    )}`
  );

  // Deploy the contract
  const ContractFactory = await hre.ethers.getContractFactory("SimpleDeployer");
  const contract = await ContractFactory.connect(impersonatedSigner).deploy();
  await contract.waitForDeployment();

  const deploymentAddress = await contract.getAddress();
  console.log(`SimpleDeployer deployed at: ${deploymentAddress}`);
  // Verify the deployed address
  if (deploymentAddress.address === targetAddress) {
    console.log(
      `Success! Contract deployed at the desired address: ${targetAddress}`
    );
  } else {
    console.error(
      `Mismatch! Expected address: ${targetAddress}, but deployed at: ${deploymentAddress}`
    );
  }

  // Stop impersonating the account
  await hre.network.provider.request({
    method: "hardhat_stopImpersonatingAccount",
    params: [deployerAddress],
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
