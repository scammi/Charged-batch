import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useChargedBatch } from "../hooks/useChargedBatch";

import { ethers } from "ethers"
import { useWeb3Context } from "../context/Web3";

type Props = {}

const MainView = ({ }: Props) => {
  const [web3] = useWeb3Context();
  const chargedBatch = useChargedBatch();

  useEffect(() => {
    (async () => {
      try {

  
      } catch (e) {
        console.log(e);
      };
    })();
  }, [web3]);

  // const BuyTicketButton = () => {
  //   const buyTicketHandle = async () => {
  //     try {
  //       const response = await shuffleOne.buyTicket({ value: ethers.utils.parseEther("0.2") });
  //       const receipt = await response.wait();
  //       setBuyTransaction(receipt);
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   };
  //   return (
  //     <Button onClick={() => { buyTicketHandle() }}> Buy ticket </Button>
  //   );
  // };

  return (
    <>
      <div>
        { }
      </div>
    </>
  );
};

export { MainView };