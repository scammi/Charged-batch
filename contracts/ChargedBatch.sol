pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol"; //OZ: ERC721

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

contract ChargedBatch {
  ChargedParticles charged;
  constructor(address deployedChargedParticles) public {
    charged = ChargedParticles(deployedChargedParticles);   
  }
  function getStateAddress() external view returns (address stateAddress) {
    return  charged.getStateAddress();
  }

  function singleBond(
    address contractAddress,
    uint256 tokenId
  ) 
  external view returns (address approved){
    return ERC721(contractAddress).getApproved(tokenId);
  }
}
