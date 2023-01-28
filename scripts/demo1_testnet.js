const { formatBytes32String } = require("ethers/lib/utils");
const { ethers } = require("ethers");
const hre = require("hardhat");

async function main() {
  const LayerZeroDemo1 = await hre.ethers.getContractFactory("LayerZeroDemo1");
  const layerZeroDemo1 = await LayerZeroDemo1.attach(
    "0x5C248Ff77F362F3195e84d784dFD36306abbd542"
  );
  const fees = await layerZeroDemo1.estimateFees(
    10109,
    "0xe872275249beD8C09675026B64Dfb268FDbaB21A",
    formatBytes32String("Hello LayerZero"),
    false,
    []
  );
  // const count = await layerZeroDemo1.messageCount();
  // const msg = await layerZeroDemo1.message();
  // console.log(count);
  // console.log(ethers.utils.formatEther(fees[0].toString()));
  const msg = await layerZeroDemo1.sendMsg(
    10109,
    "0xe872275249beD8C09675026B64Dfb268FDbaB21A",
    formatBytes32String("Hello LayerZero"),
    { value: ethers.utils.parseEther("1") }
  );
  await console.log(msg);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
