require("dotenv").config();
const hre = require("hardhat");
const ethers = hre.ethers;
const MY_ADDRESS = process.env.ARBITRUM_MY_ADDRESS_DEPLOYER;

/*
Found matching address: 0xBabe7B5fd01e48ff0f4F66C9af2a8EC12778B35c
Using salt: 0x000000000000000000000000000000000000000000000000000000000006577e
*/

async function main() {
  const simpleDeployerAddress = "0xaDd1e2816e1390de2E1bBE0009bA202508C7372B"; // Deployed SimpleDeployer contract address
  const desiredPrefix = "0xBabe"; // Target prefix to search for at the beginning of the address
  const maxAttempts = 1000000000;

  // Using the proxy bytecode you provided
  const proxyBytecode =
    "0x608060405261000c61000e565b005b7f000000000000000000000000e731fbab4b6598d782fb2f10f0afc280657e3d0c6001600160a01b0316330361007b576000356001600160e01b03191663278f794360e11b14610071576040516334ad5dbb60e21b815260040160405180910390fd5b610079610083565b565b6100796100b2565b6000806100933660048184610312565b8101906100a09190610352565b915091506100ae82826100c2565b5050565b6100796100bd61011d565b610155565b6100cb82610179565b6040516001600160a01b038316907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a28051156101155761011082826101f5565b505050565b6100ae61026b565b60006101507f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc546001600160a01b031690565b905090565b3660008037600080366000845af43d6000803e808015610174573d6000f35b3d6000fd5b806001600160a01b03163b6000036101b457604051634c9c8ce360e01b81526001600160a01b03821660048201526024015b60405180910390fd5b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc80546001600160a01b0319166001600160a01b0392909216919091179055565b6060600080846001600160a01b0316846040516102129190610422565b600060405180830381855af49150503d806000811461024d576040519150601f19603f3d011682016040523d82523d6000602084013e610252565b606091505b509150915061026285838361028a565b95945050505050565b34156100795760405163b398979f60e01b815260040160405180910390fd5b60608261029f5761029a826102e9565b6102e2565b81511580156102b657506001600160a01b0384163b155b156102df57604051639996b31560e01b81526001600160a01b03851660048201526024016101ab565b50805b9392505050565b8051156102f95780518082602001fd5b604051630a12f52160e11b815260040160405180910390fd5b6000808585111561032257600080fd5b8386111561032f57600080fd5b5050820193919092039150565b634e487b7160e01b600052604160045260246000fd5b6000806040838503121561036557600080fd5b82356001600160a01b038116811461037c57600080fd5b9150602083013567ffffffffffffffff8082111561039957600080fd5b818501915085601f8301126103ad57600080fd5b8135818111156103bf576103bf61033c565b604051601f8201601f19908116603f011681019083821181831017156103e7576103e761033c565b8160405282815288602084870101111561040057600080fd5b8260208601602083013760006020848301015280955050505050509250929050565b6000825160005b818110156104435760208186018101518583015201610429565b50600092019182525091905056fea26469706673582212200eaa125ad1466e683d9fc5e74dc036c86091777a48347f637933bad3b387876e64736f6c63430008140033";

  // Precompute the bytecode hash once
  const bytecodeHash = ethers.keccak256(proxyBytecode);

  console.log("Searching for a suitable salt...");

  let salt;
  let deploymentAddress;

  for (let i = 15000; i < maxAttempts; i++) {
    // Generate a new salt using a buffer for efficiency
    const saltBuffer = Buffer.alloc(32);
    saltBuffer.writeUInt32BE(i, 28); // Write 'i' into the last 4 bytes of the buffer
    salt = "0x" + saltBuffer.toString("hex");

    // Compute the deployment address locally
    deploymentAddress = ethers.getCreate2Address(
      simpleDeployerAddress,
      salt,
      bytecodeHash
    );

    // Check if the address starts with the exact desired prefix "0xBabe"
    if (deploymentAddress.startsWith(desiredPrefix)) {
      console.log(`Found matching address: ${deploymentAddress}`);
      console.log(`Using salt: ${salt}`);
      break;
    }

    // If we reach max attempts, log a message
    if (i === maxAttempts - 1) {
      console.log(
        `Failed to find an address starting with "${desiredPrefix}" after ${maxAttempts} attempts.`
      );
      return;
    }
  }

  //   Deploy the contract using the found salt

  //   try {
  //     console.log("Deploying with CREATE2...");
  //     const simpleDeployer = await ethers.getContractAt(
  //       "SimpleDeployer",
  //       simpleDeployerAddress
  //     );

  //     const tx = await simpleDeployer.deploy(0, salt, proxyBytecode, {
  //       gasLimit: 300000,
  //     });
  //     await tx.wait();
  //     console.log(
  //       `Proxy deployed at deterministic address: https://arbiscan.io/address/${deploymentAddress}`
  //     );
  //   } catch (error) {
  //     console.error("Deployment failed:", error);
  //   }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });
