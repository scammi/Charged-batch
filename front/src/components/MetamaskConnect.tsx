import React from 'react'
import { useWeb3Context } from '../context/Web3';
import Button from '@mui/material/Button';

export const MetamaskConnect = () => {
  const [web3, , connect, disconnect] = useWeb3Context();

  const _connectWallet = async () => {
    console.log("HEY I RUN JS !!!!!!");
    try {
      await connect();
    } catch (err) {
      console.error(err);
    }
  }

  const _disconnectWallet = async () => {
    try {
      await disconnect();
    } catch (err) {
      console.error(err);
    }
  }

  const ConnectButton = () => (
    <Button onClick={() => { _connectWallet() }}>Connect</Button>
  );

  const DisconnectButton = () => (
    <Button onClick={() => { _disconnectWallet() }}>Disconnect</Button>
  )

  return (
    <div>
      {web3.isConnected && (
        <div>
          <div className="inline">
            <DisconnectButton/>
            {/* <div className="account">{web3.connectedAccount}</div> */}
          </div>
          <br />
        </div>
      )}
      {!web3.isConnected && <ConnectButton />}
    </div>
  )
}