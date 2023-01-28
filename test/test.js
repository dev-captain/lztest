const { expect } = require("chai");
const { ethers } = require("hardhat");
const { formatBytes32String } = require("ethers/lib/utils");

describe("OmniCounter", function () {
  beforeEach(async function () {
    // use this chainId
    chainId1 = 1012;
    chainId2 = 1009;

    // create a LayerZero Endpoint mock for testing
    const LayerZeroEndpointMock = await ethers.getContractFactory(
      "LZEndpointMock"
    );
    mock1 = await LayerZeroEndpointMock.deploy(chainId1);
    mock2 = await LayerZeroEndpointMock.deploy(chainId2);
    // create two OmniCounter instances
    const OmniCounter = await ethers.getContractFactory("OmniCounter");
    counter1 = await OmniCounter.deploy(mock1.address);
    counter2 = await OmniCounter.deploy(mock2.address);
    console.log("mock", mock1.address, mock2.address);
    console.log("counter", counter1.address, counter2.address);
    mock2.setDestLzEndpoint(counter1.address, mock1.address);
    mock1.setDestLzEndpoint(counter2.address, mock2.address);
    counter1.setTrustedRemote(
      chainId2,
      ethers.utils.solidityPack(
        ["address", "address"],
        [counter2.address, counter1.address]
      )
    );
    counter2.setTrustedRemote(
      chainId1,
      ethers.utils.solidityPack(
        ["address", "address"],
        [counter1.address, counter2.address]
      )
    );
    // console.log("asdfasfd",ethers.utils.solidityPack(["address", "address"], [counter1.address, counter2.address]));
  });

  it("increment the counter of the destination OmniCounter", async function () {
    // ensure theyre both starting from 0

    expect(await counter1.counter()).to.be.equal(0); // initial value
    expect(await counter2.counter()).to.be.equal(0); // initial value

    // instruct each OmniCounter to increment the other OmniCounter
    // counter A increments counter B
    await counter1.incrementCounter(chainId2, formatBytes32String("hello"), {
      value: ethers.utils.parseEther("0.5"),
    });
    expect(await counter1.counter()).to.be.equal(0); // still 0
    expect(await counter2.counter()).to.be.equal(1); // now its 1
    expect(await counter2.message()).to.be.equal(formatBytes32String("hello"));

    // counter B increments counter A
    // await counter2.incrementCounter(chainId1, { value: ethers.utils.parseEther("0.5") })
    // expect(await counter1.counter()).to.be.equal(1) // now its 1
    // expect(await counter2.counter()).to.be.equal(1) // still 1
  });
});
