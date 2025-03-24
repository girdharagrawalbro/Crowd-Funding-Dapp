"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import toast, { Toaster } from 'react-hot-toast';

const ConnectWallet = ({ setAccount }) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [isClient, setIsClient] = useState(false); // Track if component is on the client

  useEffect(() => {
    setIsClient(true); // Set to true after component mounts on the client
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error("Please install MetaMask!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const account = await signer.getAddress();

      // Use provider to get balance, not signer
      const balance = await provider.getBalance(account);

      setWalletAddress(account);
      setAccount(account);
      setBalance(ethers.formatEther(balance)); // Convert balance from wei to ETH
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Error connecting wallet:", error);
    }
  };

  return (
    <>
      {isClient &&
        <div>
          {walletAddress ? (
            <div className="flex gap-2 text-white">
              <p className="py-3 px-4 bg-orange-300 rounded-full">Connected: {walletAddress.substring(0, 4)}...{walletAddress.slice(-4)}</p>
              <p className="py-3 px-4 rounded-full bg-blue-500">Balance: {balance.slice(0, 6)} ETH</p>
            </div>
          ) : (
            <button onClick={connectWallet} className="bg-blue-500 rounded-full text-white px-6 py-3 ">
              Connect Wallet
            </button>
          )}
        </div>
      }
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </>
  );
};

export default ConnectWallet;