import React, { useEffect, useState } from "react";

import { useChargedBatch } from "../hooks/useChargedBatch";
import { useSoul } from "../hooks/useSoul";

import { CSVSelector } from "./CSVSelector";
import { useWeb3Context } from "../context/Web3";
import _ from "lodash";

// MUI 
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

type Props = {}

const MainView = ({ }: Props) => {
  const [ web3 ] = useWeb3Context();

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
        const ownerOfFirst = await soul.ownerOf(1);
        console.log('1 NFT owner >>>>>>> ', ownerOfFirst);

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

  // stepper
  const steps = ['Approve', 'Upload CSV', 'Bond'];
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length  ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Box py="40px">
            {activeStep === 0 ? <IsApprovedForAllButton /> : 
              activeStep === 1 ? <CSVSelector setBatchData={setBatchData}/> : <BatchBondButton />
            }
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
};

export { MainView };