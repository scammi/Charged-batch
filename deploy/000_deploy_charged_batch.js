  module.exports = async function (hre) {
    const {deployments, getNamedAccounts, ethers, network} = hre;
    const {deploy} = deployments;
  
    const {deployer} = await getNamedAccounts();
    // const chainId = network.config.chainId
  
    await deploy('ChargedBatch', {
      from: deployer,
      args: [
        '0x3A9891279481bB968a8d1300C40d9279111f1CDA'
      ],
      log: true,
    });
  };
  
  module.exports.tags = ['ChargedBatch'];