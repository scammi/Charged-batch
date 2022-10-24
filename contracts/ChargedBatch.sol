pragma solidity ^0.8.0;

interface ChargedParticles {

  function covalentBond(
    address contractAddress,
    uint256 tokenId,
    string calldata basketManagerId,
    address nftTokenAddress,
    uint256 nftTokenId,
    uint256 nftTokenAmount
  ) external returns (bool success);

  function getStateAddress() external view returns (address stateAddress);
}

contract Loop {
  ChargedParticles charged;
  constructor(address deployedChargedParticles) public {
    charged = ChargedParticles(deployedChargedParticles);   
  }
  function getStateAddress() external view returns (address stateAddress) {
    return  charged.getStateAddress();
  }
}
