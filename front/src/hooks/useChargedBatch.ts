import React from "react";
import { Contract } from "ethers";
import { GLOBALS } from "../utils/globals";
import chargedBatch from "../../../deployments/localhost/ChargedBatch.json"

import { useWeb3Context } from "../context/Web3";

const useChargedBatch = () => {
  const [ web3 ] = useWeb3Context();

  const chainId = web3.chainId == 1337 ? 31337 : web3.chainId ;
  const chargedBatchAddress = GLOBALS.CONTRACT_ADDRESSES.chargedBatch[chainId];

  const provider = web3.writeProvider ? web3.writeProvider.getSigner() : web3.readProvider;
  const contract = new Contract(chargedBatchAddress, chargedBatch.abi, provider);

  return contract;
};

export { useChargedBatch };