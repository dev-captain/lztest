const hre = require("hardhat");
const { LZ_ADDRESS } = require("@layerzerolabs/lz-sdk");

async function main() {
  hre.run("compile");
  const [deployer] = await ethers.getSigners(); 

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const OmniChat = await hre.ethers.getContractFactory("OmniChat");
  const endpointAddr = LZ_ADDRESS[hre.network.name];
  const omniChat = await OmniChat.deploy(endpointAddr);

  await omniChat.deployed();
  console.log("Contract deployed to address:", omniChat.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
