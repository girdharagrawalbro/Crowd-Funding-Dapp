"use client";
import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import DonationCard from '../components/DonationCard';
import toast from 'react-hot-toast';

export default function DonorDashboard() {
  const { userId } = useSelector((state) => state.account);
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState({
    totalDonations: 0,
    supportedCampaigns: 0,
    successfulCampaigns: 0,
    eligibleRefunds: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchDonorData = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/donations?donorId=${userId}`);
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to fetch donations');

      const donorDonations = data.map(d => ({
        id: d.id,
        title: d.campaign?.title || 'Unknown Campaign',
        amount: d.amount,
        donatedAt: new Date(d.donatedAt),
        status: d.campaign?.status || 'Active',
        goal: d.campaign?.goal,
        amountCollected: d.campaign?.amountCollected
      }));

      const totalDonated = donorDonations.reduce((acc, curr) => acc + Number(curr.amount), 0);
      const successful = donorDonations.filter(d => d.amountCollected >= d.goal).length;

      setDonations(donorDonations);
      setStats({
        totalDonations: totalDonated,
        supportedCampaigns: donorDonations.length,
        successfulCampaigns: successful,
        eligibleRefunds: 0 // Refund logic can be added if needed for Rupee version
      });
    } catch (error) {
      console.error("Error fetching donor data:", error);
      toast.error("Failed to fetch donation data");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchDonorData();
  }, [fetchDonorData]);

  if (!userId) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-600">Please login to view your dashboard</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="theme-bg border border-green-300 theme-text p-6 rounded-lg mb-8">
        <h1 className="text-3xl font-bold">Donor Dashboard</h1>
        <p>Your contributions to help others</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Donated" value={`₹${stats.totalDonations}`} />
        <StatCard title="Supported Campaigns" value={stats.supportedCampaigns} />
        <StatCard title="Successful Campaigns" value={stats.successfulCampaigns} />
        <StatCard title="Refunds Available" value={stats.eligibleRefunds} />
      </div>

      <h2 className="text-2xl font-semibold mb-4">Your Contributions</h2>
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        </div>
      ) : donations.length === 0 ? (
        <p className="text-gray-600">You haven't donated to any campaigns yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donations.map(donation => (
            <DonationCard
              key={donation.id}
              donation={donation}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const StatCard = ({ title, value }) => (
  <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold theme-text">{value}</p>
  </div>
);