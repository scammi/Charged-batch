const { expect } = require("chai");
const { ethers, deployments } = require("hardhat");

const { default: Charged, goerliAddresses, protonBAbi } = require("@charged-particles/charged-js-sdk");

describe("Charged", function () {

  let batch;

  beforeEach(async () => {
    await deployments.fixture(["ChargedBatch"]);
    batch = await ethers.getContract("ChargedBatch");
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

      const txApprove = await erc721Contract.approve(batch.address, protonId.toString());
      await txApprove.wait();

      const approved = await batch.singleBond(goerliAddresses.protonB.address, protonId.toString());
      expect(approved).to.equal(batch.address);
    });
  });
})