
const { ethers } = require("hardhat");

// RUN 
// npx hardhat run --network localhost scripts/foundTestAccount.js

(async () => {
  const soul = await ethers.getContract("Soul")
  const mintPromises = [1, 2, 3, 4].map(() => {
    return soul.safeMint(
      '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', // to
      'tokenUri.com',
    );
  });

  await Promise.all(mintPromises);
})()