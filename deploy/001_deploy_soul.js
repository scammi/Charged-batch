module.exports = async function (hre) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();
  // const chainId = network.config.chainId

  await deploy('Soul', {
    from: deployer,
    args: [],
    log: true,
  });
};

module.exports.tags = ['Soul'];