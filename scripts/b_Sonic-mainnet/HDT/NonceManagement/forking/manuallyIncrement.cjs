const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {
  const impersonatedSigner = await ethers.getSigner(
    "0x951204CB69C2e24572FeB727f9fCD837404eBf70"
  );
  const tx = await impersonatedSigner.sendTransaction({
    to: "0x951204CB69C2e24572FeB727f9fCD837404eBf70", // Self-transfer
    value: ethers.parseEther("0"),
  });
  await tx.wait();

  console.log(`Nonce incremented to 2.`);
}

main();
