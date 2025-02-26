const hre = require("hardhat");
const ethers = hre.ethers;

async function deployContract() {
  const deployerAddress = "0x951204CB69C2e24572FeB727f9fCD837404eBf70";

  // Impersonate the deployer
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [deployerAddress],
  });
  const impersonatedSigner = await ethers.getSigner(deployerAddress);

  // Deploy the contract
  const ContractFactory = await hre.ethers.getContractFactory("SimpleDeployer");
  const contract = await ContractFactory.connect(impersonatedSigner).deploy();
  await contract.waitForDeployment();

  const deploymentAddress = await contract.getAddress();
  console.log(`SimpleDeployer deployed at: ${deploymentAddress}`);

  // Verify if it matches the target address
  const targetAddress = "0x6a45Ca6f11E6C18215e81Ae1741A9E5c60B53104";
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

deployContract()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
