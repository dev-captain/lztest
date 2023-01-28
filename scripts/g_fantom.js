const hre = require("hardhat");
const { ethers, artifacts } = require("hardhat");
const fs = require("fs");
const path = require("path");
async function main() {
  const Mock = await ethers.getContractFactory("LZEndpointMock");
  const mock = await Mock.deploy(1113);
  const Counter = await ethers.getContractFactory("OmniCounter");
  const counter = await Counter.deploy(mock.address);
  await counter.deployed();
  console.log(counter.address);
  const mock1 = artifacts.readArtifactSync("LZEndpointMock");
  mock1.address = mock.address;
  const counter1 = artifacts.readArtifactSync("OmniCounter");
  counter1.address = counter.address;
  const fantomDir = path.join(
    __dirname,
    "..",
    "..",
    "frontend",
    "fantom",
    "src",
    "contracts"
  );
  const mumbaiDir = path.join(
    __dirname,
    "..",
    "..",
    "frontend",
    "mumbai",
    "src",
    "contracts"
  );

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
  fs.writeFileSync(
    path.join(mumbaiDir, "mock1.json"),
    JSON.stringify(mock1)
  );

  fs.writeFileSync(
    path.join(fantomDir, "mock1.json"),
    JSON.stringify(mock1)
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
