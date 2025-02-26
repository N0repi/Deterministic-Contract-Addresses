const { ethers } = require("hardhat");

async function main() {
  const logicAddress = "0xYourLogicContractAddress"; // Replace with actual address
  const adminAddress = "0xYourAdminAddress"; // Replace with actual address
  const initData = "0x"; // Initialization data, if any

  // Get bytecode from TransparentUpgradeableProxy
  const proxyBytecode = require("@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol");

  const proxyFactory = new ethers.ContractFactory(
    [],
    proxyBytecode,
    ethers.provider
  );
  const proxy = await proxyFactory.deploy(logicAddress, adminAddress, initData);

  console.log(`Proxy deployed to: ${proxy.address}`);
  const runtimeBytecode = await ethers.provider.getCode(proxy.address);
  console.log("Runtime bytecode:", runtimeBytecode);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
