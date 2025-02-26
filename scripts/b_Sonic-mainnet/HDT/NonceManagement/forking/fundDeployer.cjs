const ethers = require("ethers");

async function main() {
  const [signer] = await ethers.getSigners();
  await signer.sendTransaction({
    to: "0x951204CB69C2e24572FeB727f9fCD837404eBf70", // Replace with your deployer's address
    value: ethers.parseEther("100"), // Send 100 ETH
  });
}

main();
