"use client";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ethers } from "ethers";
import toast from "react-hot-toast";
import { setAccount, disconnectAccount } from "../store/slices/accountSlice";
import { createUser } from '../store/slices/userSlice';

import Link from "next/link";

const ConnectWallet = ({ mobile = false }) => {
  const dispatch = useDispatch();
  const { walletAddress, balance } = useSelector((state) => state.account);
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => {
        disconnectWallet();
      });
    }
  }, []);

  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  const connectWallet = async () => {
    if (isMobileDevice()) {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const account = await signer.getAddress();
          const balance = await provider.getBalance(account);

          dispatch(setAccount({
            walletAddress: account,
            balance: ethers.formatEther(balance)
          }));
          toast.success("Wallet Connected!");
           
      dispatch(createUser({ metaid: account, name: 'User' }));
          
           
        } catch (error) {
          console.error("Error connecting wallet:", error);
          toast.error("Error connecting wallet!");
        }
      } else {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        if (/android/i.test(userAgent) || /iPad|iPhone|iPod/.test(userAgent)) {
          window.location.href = "https://metamask.app.link/dapp/" + window.location.hostname;
        } else {
          window.open("https://metamask.io/download.html", "_blank");
        }
      }
      return;
    }

    if (!window.ethereum) {
      toast.error("Please install MetaMask!");
      window.open("https://metamask.io/download.html", "_blank");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const account = await signer.getAddress();
      const balance = await provider.getBalance(account);

      dispatch(setAccount({
        walletAddress: account,
        balance: ethers.formatEther(balance)
      }));
      toast.success("Wallet Connected!");
      dispatch(createUser({ metaid: account, name: 'User' }));
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Error connecting wallet!");
    }
  };

  const disconnectWallet = useCallback(() => {
    dispatch(disconnectAccount());
    toast.error("Wallet Changed!");
    setIsMenuOpen(false);
  }, [dispatch]);

  return (
    <>
      <div className="relative">
        {walletAddress ? (
          <div className="flex items-center gap-2">
            {/* Wallet Address Button (always visible) */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(walletAddress);
                toast.success('Wallet address copied to clipboard!');
              }}
              className={`bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 rounded-full text-white ${mobile ? 'py-2 px-3 text-xs' : 'py-2 px-4 text-sm'
                }`}
            >
              {walletAddress.substring(0, 4)}...{walletAddress.slice(-4)}
            </button>

            {/* Hamburger Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full hover:bg-gray-200 focus:outline-none"
            >
              {isMenuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>

              ) : (
                <svg
                  className="w-5 h-5 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 top-7 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                {/* Balance */}
                <div className="px-4 py-2 text-sm text-gray-700 border-b">
                  Balance: {balance.slice(0, 6)} ETH
                </div>

                {/* My Campaigns */}
                <Link
                  href="/creator-dashboard"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Campaigns
                </Link>

                {/* My Donations */}
                <Link
                  href="/donor-dashboard"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Donations
                </Link>

                {/* Disconnect */}
                <button
                  onClick={disconnectWallet}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={connectWallet}
            className={`bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 rounded-full text-white ${mobile ? 'py-2 px-4 text-sm' : 'py-2 px-6'
              }`}
          >
            Connect Wallet
          </button>
        )}
      </div>
    </>
  );
};

export default ConnectWallet;