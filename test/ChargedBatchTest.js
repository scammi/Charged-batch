const { expect } = require("chai");
const { ethers, deployments, network } = require("hardhat");

const { default: Charged, goerliAddresses, protonBAbi, chargedParticlesAbi, chargedSettingsAbi } = require("@charged-particles/charged-js-sdk");

describe("Charged", function () {
  const ChargedParticlesContract = new ethers.Contract(goerliAddresses.chargedParticles.address, chargedParticlesAbi);
  const ChargedSettingContract = new ethers.Contract(goerliAddresses.chargedSettings.address, chargedSettingsAbi);

  let batch, soul, signers, adminAddress, customNFTdeployedAddress;

  beforeEach(async () => {
    await deployments.fixture(["ChargedBatch"]);
    batch = await ethers.getContract("ChargedBatch");
    soul = await ethers.getContract("Soul");

    // Get Charged Particle owner address
    adminAddress = await ChargedParticlesContract.connect(ethers.provider).owner();
    customNFTdeployedAddress = soul.address;

    // // impersonate admin account 
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [adminAddress],
    });

    const owner = await ethers.getSigner(adminAddress);
    const whiteListTx = await ChargedSettingContract.connect(owner).enableNftContracts([customNFTdeployedAddress]);
    await whiteListTx.wait();

    signers = await ethers.getSigners();
  });

  afterEach(async () => {
    await hre.network.provider.request({
      method: "hardhat_stopImpersonatingAccount",
      params: [adminAddress],
    });
  });

  describe("ChargedBatch", function () {

    it("Should interact with main contract", async () => {
      const stateAddress = await batch.getStateAddress();
      expect(stateAddress).to.be.equal("0x3e9A9544f8a995DF33771E84600E02a2fc81De58");
    });

    it("Single bond", async () => {
      const signer = ethers.provider.getSigner();
      const signerAddress = await signer.getAddress();

      const charged = new Charged({ providers: ethers.provider, signer });

      const nft = charged.NFT(goerliAddresses.protonB.address, 1);

      const bondCountBeforeDeposit = await nft.getBonds('generic.B');
      const currentTestNetwork = await ethers.provider.getNetwork();
      const bondCountBeforeDepositValue = bondCountBeforeDeposit[currentTestNetwork.chainId].value;

      expect(bondCountBeforeDepositValue.toNumber()).equal(0);

      // Mint proton
      const erc721Contract = new ethers.Contract(goerliAddresses.protonB.address, protonBAbi, signer);
      const protonId = await erc721Contract.callStatic.createBasicProton(
        signerAddress,
        signerAddress,
        'tokenUri.com',
      );

      const txCreateProton = await erc721Contract.createBasicProton(
        signerAddress,
        signerAddress,
        'tokenUri.com',
      );

      await txCreateProton.wait();

      const txApprove = await erc721Contract.setApprovalForAll(batch.address, true);
      await txApprove.wait();

      const approvedBeforeBatchAction = await erc721Contract.isApprovedForAll(signerAddress, batch.address);
      expect(approvedBeforeBatchAction).to.equal(true);

      const singleBond = await batch.singleBond(
        goerliAddresses.protonB.address,
        protonId.toString(),
        'generic.B',
        goerliAddresses.protonB.address,
        1,
        1
      );
      const singleBondReceipt = await singleBond.wait();
      console.log(singleBond, singleBondReceipt);

      // const approved = await erc721Contract.getApproved(protonId.toString());
      // expect(approved).to.equal(goerliAddresses.chargedParticles.address);
    });
  });
})