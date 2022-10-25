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

    // impersonate admin account 
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
      const currentTestNetwork = await ethers.provider.getNetwork();

      const charged = new Charged({ providers: ethers.provider, signer });

      const nft = charged.NFT(goerliAddresses.protonB.address, 1);
      const bondCountBeforeDeposit = await nft.getBonds('generic.B');
      const bondCountBeforeDepositValue = bondCountBeforeDeposit[currentTestNetwork.chainId].value;
      expect(bondCountBeforeDepositValue.toNumber()).equal(0);

      // Mint proton
      const soulId = await soul.callStatic.safeMint(
        signerAddress,
        'tokenUri.com',
      );

      const txCreateProton = await soul.safeMint(
        signerAddress,
        'tokenUri.com',
      );

      await txCreateProton.wait();

      const txApprove = await soul.setApprovalForAll(batch.address, true);
      await txApprove.wait();

      const approvedBeforeBatchAction = await soul.isApprovedForAll(signerAddress, batch.address);
      expect(approvedBeforeBatchAction).to.equal(true);

      const singleBond = await batch.singleBond(
        goerliAddresses.protonB.address,
        1,
        'generic.B',
        soul.address,
        soulId.toString(),
        1
      );

      await singleBond.wait();
      const bondCountAfterDeposit = await nft.getBonds('generic.B');
      const bondCountAfterDepositValue = bondCountAfterDeposit[currentTestNetwork.chainId].value;
      expect(bondCountAfterDepositValue.toNumber()).equal(1);
    });
  });
})