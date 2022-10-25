import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useChargedBatch } from "../hooks/useChargedBatch";
import { useSoul } from "../hooks/useSoul";

import { ethers } from "ethers"
import { useWeb3Context } from "../context/Web3";

type Props = {}

const MainView = ({ }: Props) => {
  const [web3] = useWeb3Context();

  const chargedBatch = useChargedBatch();
  const soul = useSoul();

  const [ isApprovedForAll, setIsApprovedForAll ] = useState(false);
  const [ approvalForAllTransaction, setApprovalForAllTransaction ] = useState();

  useEffect(() => {
    (async () => {
      try {
        const approvedForAll = await soul.isApprovedForAll(web3.wallet, chargedBatch.address);
        console.log('>>>>>>>> ' ,approvedForAll);
        setIsApprovedForAll(approvedForAll);

      } catch (e) {
        console.log(e);
      };
    })();
  }, [web3, soul, chargedBatch, approvalForAllTransaction]);

  const SetIsApprovedForAllButton = () => {
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
      <Button onClick={() => { approveAllHandle() }}> Approve </Button>
    );
  };

  return (
    <>
      <div>
        <SetIsApprovedForAllButton /> 
      </div>
    </>
  );
};

export { MainView };