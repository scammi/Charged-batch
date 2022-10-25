require("@nomiclabs/hardhat-ethers");
require("hardhat-deploy");
require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.7",
      },
      {
        version: "0.6.6",
      },
      {
        version: "0.4.24",
      },
    ],
  },
  namedAccounts: {
    deployer: 0,
    tokenOwner: 1,
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    hardhat: {
      chainId: 5,
      forking: {
        url: "https://eth-goerli.g.alchemy.com/v2/Gc62sJ3OMpPiloXAvCWtJfI1rxlSlwuf",
        blockNumber: 7827722
      }
    },
  }
};
