const hre = require("hardhat");
const { ethers } = require("hardhat")
const fs = require("fs");
const path = require("path")
async function main() {

  const Counter = await ethers.getContractFactory("OmniCounter");
  const counter = await Counter.deploy('0x7dcAD72640F835B0FA36EFD3D6d3ec902C7E5acf')
  await counter.deployed()
  console.log(counter.address);

  const counter1 = artifacts.readArtifactSync("OmniCounter");
  counter1.address = counter.address
  const fantomDir = path.join(__dirname, "..", "..","frontend", "fantom", "src","contracts");
  const mumbaiDir = path.join(__dirname, "..", "..","frontend", "mumbai", "src","contracts");

  if (!fs.existsSync(fantomDir)) {
    fs.mkdirSync(fantomDir);
  }
  if (!fs.existsSync(mumbaiDir)) {
    fs.mkdirSync(mumbaiDir);
  }

  fs.writeFileSync(
    path.join(mumbaiDir, "counter1.json"),
    JSON.stringify(counter1)
  );

  fs.writeFileSync(
    path.join(fantomDir, "counter1.json"),
    JSON.stringify(counter1)
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
