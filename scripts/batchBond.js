
const { ethers } = require("hardhat");
const { goerliAddresses } = require("@charged-particles/charged-js-sdk");

(async () => {
  console.log('>>>>>')
  const batch = await ethers.getContract("ChargedBatch");
  const soul = await ethers.getContract("Soul");

  const txApprove = await soul.setApprovalForAll(batch.address, true);
  console.log(txApprove);
  console.log(await txApprove.wait());

  // await batch.createBonds(
  //   'generic.B',
  //   [
  //     {
  //       basketNftAddress: goerliAddresses.protonB.address,
  //       basketNftTokenId: 1,
  //       nftTokenAddress: soul.address,
  //       nftTokenId: 1,
  //       nftTokenAmount: 1
  //     },
  //     {
  //       basketNftAddress: goerliAddresses.protonB.address,
  //       basketNftTokenId: 1,
  //       nftTokenAddress: soul.address,
  //       nftTokenId: 2,
  //       nftTokenAmount: 1
  //     },
  //     {
  //       basketNftAddress: goerliAddresses.protonB.address,
  //       basketNftTokenId: 2,
  //       nftTokenAddress: soul.address,
  //       nftTokenId: 3,
  //       nftTokenAmount: 1
  //     }
  //   ]
  // );

})();