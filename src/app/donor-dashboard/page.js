"use client";
import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { ethers } from 'ethers';
import DonationCard from '../components/DonationCard';
import toast from 'react-hot-toast';
import { contractABI, contractAddress } from "../lib/constants";


export default function DonorDashboard() {
  const { walletAddress } = useSelector((state) => state.account);
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState({
    totalDonations: 0,
    supportedCampaigns: 0,
    successfulCampaigns: 0,
    eligibleRefunds: 0
  });
  const [contract, setContract] = useState(null);

  const fetchDonorData = useCallback(async () => {
    if (!contract || !walletAddress) return;

    try {
      const count = await contract.campaignCount();
      let donorDonations = [];
      let totalDonated = 0;
      let successful = 0;
      let eligibleRefunds = 0;

      for (let i = 0; i < count; i++) {
        const amount = await contract.getDonationAmount(i, walletAddress);
        if (amount > 0) {
          const campaignData = await contract.getCampaign(i);
          const deadline = new Date(Number(campaignData.deadline) * 1000);
          const isEnded = new Date() > deadline;
          const isSuccessful = campaignData.amountCollected >= campaignData.goal;
          const isEligibleForRefund = isEnded && !isSuccessful;

          const campaign = {
            id: i,
            owner: campaignData.owner,
            title: campaignData.title,
            description: campaignData.description,
            goal: parseFloat(ethers.formatEther(campaignData.goal)),
            deadline,
            amountCollected: parseFloat(ethers.formatEther(campaignData.amountCollected)),
            amount: parseFloat(ethers.formatEther(amount)),
            isEnded,
            isSuccessful,
            isEligibleForRefund
          };

          donorDonations.push(campaign);
          totalDonated += campaign.amount;
          if (isSuccessful) successful++;
          if (isEligibleForRefund) eligibleRefunds++;
        }
      }

      setDonations(donorDonations);
      setStats({
        totalDonations: totalDonated,
        supportedCampaigns: donorDonations.length,
        successfulCampaigns: successful,
        eligibleRefunds
      });
    } catch (error) {
      console.error("Error fetching donor data:", error);
      toast.error("Failed to fetch donation data");
    }
  }, [contract, walletAddress]);

  useEffect(() => {
    if (!walletAddress) return;

    const initializeContract = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
        const crowdfundingContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        setContract(crowdfundingContract);
      } catch (error) {
        console.error("Error initializing contract:", error);
        toast.error("Failed to initialize contract");
      }
    };

    initializeContract();
  }, [walletAddress]);

  useEffect(() => {
    if (contract && walletAddress) {
      fetchDonorData();
    }
  }, [contract, walletAddress, fetchDonorData]);

  const handleRefund = async (campaignId) => {
    try {
      const tx = await contract.refund(campaignId);
      await tx.wait();
      toast.success("Refund processed successfully!");
      fetchDonorData();
    } catch (error) {
      console.error("Refund failed:", error);
      toast.error("Refund failed");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="theme-bg border border-green-300 theme-text p-6 rounded-lg mb-8">
        <h1 className="text-3xl font-bold">Donor Dashboard</h1>
        <p>Your crowdfunding contributions</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Donations" value={`${stats.totalDonations.toFixed(5)} ETH`} />
        <StatCard title="Supported Campaigns" value={stats.supportedCampaigns} />
        <StatCard title="Successful Campaigns" value={stats.successfulCampaigns} />
        <StatCard title="Eligible Refunds" value={stats.eligibleRefunds} />
      </div>

      <h2 className="text-2xl font-semibold mb-4">Your Contributions</h2>
      {donations.length === 0 ? (
        <p className="text-gray-600">You havent donated to any campaigns yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donations.map(donation => (
            <DonationCard
              key={donation.id}
              donation={donation}
              onRefund={handleRefund}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const StatCard = ({ title, value }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);