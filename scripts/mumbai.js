const hre = require("hardhat");
const { ethers } = require("hardhat")
const fs = require("fs")
const path = require("path")
async function main() {

  const Counter = await ethers.getContractFactory("OmniCounter");
  const counter = await Counter.deploy('0xf69186dfBa60DdB133E91E9A4B5673624293d8F8')
  await counter.deployed()
  console.log(counter.address);
  const counter2 = artifacts.readArtifactSync("OmniCounter");
  counter2.address = counter.address
  const fantomDir = path.join(__dirname, "..", "..","frontend", "fantom", "src","contracts");
  const mumbaiDir = path.join(__dirname, "..", "..","frontend", "mumbai", "src","contracts");

  if (!fs.existsSync(fantomDir)) {
    fs.mkdirSync(fantomDir);
  }
  if (!fs.existsSync(mumbaiDir)) {
    fs.mkdirSync(mumbaiDir);
  }

  fs.writeFileSync(
    path.join(mumbaiDir, "counter2.json"),
    JSON.stringify(counter2)
  );

  fs.writeFileSync(
    path.join(fantomDir, "counter2.json"),
    JSON.stringify(counter2)
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
