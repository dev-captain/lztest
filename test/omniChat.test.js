const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("OmniChat", () => {
  beforeEach(async () => {
    this.srcChainId = 1;
    this.dstChainId = 2;

    const LZEndpointMock = await hre.ethers.getContractFactory("LZEndpointMock");
    this.srcLzEndpointMock = await LZEndpointMock.deploy(this.srcChainId);
    this.dstLzEndpointMock = await LZEndpointMock.deploy(this.dstChainId);

    this.mockEstimatedNativeFee = ethers.utils.parseEther("0.001");
    this.mockEstimatedZroFee = ethers.utils.parseEther("0.00025");
    await this.srcLzEndpointMock.setEstimatedFees(this.mockEstimatedNativeFee, this.mockEstimatedZroFee);
    await this.dstLzEndpointMock.setEstimatedFees(this.mockEstimatedNativeFee, this.mockEstimatedZroFee);

    const OmniChat = await hre.ethers.getContractFactory("OmniChat");
    this.omniChatA = await OmniChat.deploy(this.srcLzEndpointMock.address);
    this.omniChatB = await OmniChat.deploy(this.dstLzEndpointMock.address);

    await this.srcLzEndpointMock.setDestLzEndpoint(this.omniChatB.address, this.dstLzEndpointMock.address);
    await this.dstLzEndpointMock.setDestLzEndpoint(this.omniChatA.address, this.srcLzEndpointMock.address);

    await this.omniChatA.setTrustedRemote(this.dstChainId, this.omniChatB.address);
    await this.omniChatB.setTrustedRemote(this.srcChainId, this.omniChatA.address);
  });

  it("successfully sends messages", async () => {
    const [srcAcc, dstAcc] = await ethers.getSigners();

    await this.omniChatA.sendMessage(this.dstChainId, dstAcc.address, "test message 1", { value: ethers.utils.parseEther("0.5") });
    const aMessages = await this.omniChatA.getMessages(this.dstChainId, dstAcc.address);
    const bMessages = await this.omniChatB.connect(dstAcc).getMessages(this.srcChainId, srcAcc.address);

    expect(aMessages).to.have.lengthOf(0);
    expect(bMessages).to.have.lengthOf(1);
  });
});