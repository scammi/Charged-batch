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
  struct Bond {
    address basketNftAddress;
    uint256 basketNftTokenId;
    address nftTokenAddress;
    uint256 nftTokenId;
    uint256 nftTokenAmount;
  }

  constructor(address deployedChargedParticles) public {
    charged = ChargedParticles(deployedChargedParticles);   
  }
  function getStateAddress() external view returns (address stateAddress) {
    return  charged.getStateAddress();
  }

  function singleBond(
    address contractAddress,
    uint256 tokenId,
    string calldata basketManagerId, 
    address nftTokenAddress,
    uint256 nftTokenId,
    uint256 nftTokenAmount
  ) public returns (address approved) {
    address owner = ERC721(nftTokenAddress).ownerOf(nftTokenId);
    require(! ERC721(contractAddress).isApprovedForAll(owner, address(this)), "Missing permission");
    
    ERC721(nftTokenAddress).transferFrom(owner, address(this), nftTokenId);
    ERC721(nftTokenAddress).approve(address(charged), nftTokenId);

    charged.covalentBond(contractAddress, tokenId, basketManagerId, nftTokenAddress, nftTokenId, nftTokenAmount);
    return ERC721(contractAddress).getApproved(tokenId);
  }

  function createBonds(
    string calldata basketManagerId,  
    Bond[] memory bonds
  ) external returns (uint count) {

    for (uint256 i = 0; i < bonds.length; i ++) {
      singleBond(
        bonds[i].basketNftAddress,
        bonds[i].basketNftTokenId,
        basketManagerId,
        bonds[i].nftTokenAddress,
        bonds[i].nftTokenId,
        bonds[i].nftTokenAmount
      ); 
    }

    return bonds.length;
  }
}
