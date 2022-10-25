import React from "react";
import { Contract } from "ethers";
import { GLOBALS } from "../utils/globals";
import soul from "../../../deployments/localhost/Soul.json"

import { useWeb3Context } from "../context/Web3";

const useSoul = () => {
  const [ web3 ] = useWeb3Context();

  const chainId = web3.chainId == 1337 ? 31337 : web3.chainId ;
  const soulAddress = GLOBALS.CONTRACT_ADDRESSES.soul[chainId];

  const provider = web3.writeProvider ? web3.writeProvider.getSigner() : web3.readProvider;
  const contract = new Contract(soulAddress, soul.abi, provider);

  return contract;
};

export { useSoul };