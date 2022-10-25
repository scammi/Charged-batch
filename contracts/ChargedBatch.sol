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
  ) external returns (address approved) {
    // require(ERC721(contractAddress).getApproved(tokenId) == address(this), "Missing permission");
    
    // TODO manage erc1155
    address owner = ERC721(nftTokenAddress).ownerOf(tokenId);
    ERC721(nftTokenAddress).transferFrom(owner, address(this), nftTokenId);
    ERC721(nftTokenAddress).approve(address(charged), tokenId);

    charged.covalentBond(contractAddress, tokenId, basketManagerId, nftTokenAddress, nftTokenId, nftTokenAmount);
    return ERC721(contractAddress).getApproved(tokenId);
  }

  function createBonds(Bond[] memory bonds) external pure returns (uint count) {
    return bonds.length;
  }
}
