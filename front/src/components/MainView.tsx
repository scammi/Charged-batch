import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { goerliAddresses } from "@charged-particles/charged-js-sdk";

import { useChargedBatch } from "../hooks/useChargedBatch";
import { useSoul } from "../hooks/useSoul";

import { CSVSelector } from "./CSVSelector";
import { useWeb3Context } from "../context/Web3";
import _ from "lodash";

type Props = {}

const MainView = ({ }: Props) => {
  const [web3] = useWeb3Context();

  const chargedBatch = useChargedBatch();
  const soul = useSoul();

  const [ isApprovedForAll, setIsApprovedForAll ] = useState(false);
  const [ approvalForAllTransaction, setApprovalForAllTransaction ] = useState();
  const [ batchBondTransaction, setBatchBondTransaction ] = useState();
  const [ batchData, setBatchData ] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const approvedForAll = await soul.isApprovedForAll(web3.wallet, chargedBatch.address);
        setIsApprovedForAll(approvedForAll);
      } catch (e) {
        console.log(e);
      };
    })();
  }, [web3, soul, chargedBatch, approvalForAllTransaction, batchBondTransaction]);

  const IsApprovedForAllButton = () => {
    const approveAllHandle = async () => {
      try {
        const response = await soul.setApprovalForAll(chargedBatch.address, true);
        const receipt = await response.wait();
        setApprovalForAllTransaction(receipt);
      } catch (e) {
        console.log(e);
      }
    };
    return (
      <Button 
        onClick={() => { approveAllHandle() }}
        disabled={isApprovedForAll}
      > 
        Approve 
      </Button>
    );
  };

  const BatchBondButton = () => {
    const batchBondHandle = async () => {
      try {
        console.log(batchData);
        const response = await chargedBatch.createBonds(
          'generic.B',
          batchData
        );
        const receipt = await response.wait();
        console.log({receipt});
        setBatchBondTransaction(receipt);
      } catch (e) {
        console.log(e);
      }
    };
    return (
      <Button 
        onClick={() => { batchBondHandle() }}
        disabled={!isApprovedForAll && ! _.isEmpty(batchData)}
      > 
        Batch Bonding 
      </Button>
    );
  }

  return (
    <>
      <div>
        <IsApprovedForAllButton /> 
        <BatchBondButton /> 
        <CSVSelector setBatchData={setBatchData}/>
      </div>
    </>
  );
};

export { MainView };