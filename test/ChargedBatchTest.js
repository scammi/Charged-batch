const { expect } = require("chai");
const { ethers, deployments } = require("hardhat");

const { default: Charged, mainnetAddresses } = require("@charged-particles/charged-js-sdk");

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
      const charged = new Charged({ providers: ethers.provider });

      const nft = charged.NFT(mainnetAddresses.protonB.address, 1);
      
      const bondCountBeforeDeposit = await nft.getBonds('generic.B');
      const currentTestNetwork = await ethers.provider.getNetwork();
      const bondCountBeforeDepositValue = bondCountBeforeDeposit[currentTestNetwork.chainId].value;

      expect(bondCountBeforeDepositValue.toNumber()).equal(0);
    });
  });
})