"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import toast from 'react-hot-toast';
import Circle from "../../components/Circle";

export default function CampaignDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { userId, name: userName } = useSelector(state => state.account);

  const [campaign, setCampaign] = useState(null);
  const [donationAmount, setDonationAmount] = useState("");
  const [donors, setDonors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDonating, setIsDonating] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      // Fetch campaign
      const campaignRes = await fetch(`/api/events`);
      const allCampaigns = await campaignRes.json();
      const foundCampaign = allCampaigns.find(c => c._id === id || c.id === id);

      if (foundCampaign) {
        setCampaign(foundCampaign);
      }

      // Fetch donors
      const donorsRes = await fetch(`/api/donations?campaignId=${id}`);
      const donorsData = await donorsRes.json();
      setDonors(donorsData);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load campaign details");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!userId) {
      toast.error("Please login to donate");
      return;
    }

    if (!donationAmount || isNaN(donationAmount) || parseFloat(donationAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsDonating(true);
    try {
      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId: id,
          donorId: userId,
          donorName: userName,
          amount: donationAmount,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Donation failed");

      toast.success(`Succesfully donated ₹${donationAmount}!`);
      setDonationAmount("");
      loadData(); // Refresh data
    } catch (error) {
      console.error("Donation error:", error);
      toast.error(error.message || "Failed to process donation");
    } finally {
      setIsDonating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-600">Campaign not found</h2>
        <button onClick={() => router.push('/')} className="mt-4 text-teal-600 hover:underline">Return Home</button>
      </div>
    );
  }

  const progress = (campaign.amountCollected / campaign.goal) * 100;
  const isExpired = new Date() > new Date(campaign.deadline);

  return (
    <div className="relative min-h-screen py-10 px-4">
      <Circle />

      <div className="max-w-4xl mx-auto z-10 relative">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          {/* Header Section */}
          <div className="p-8 md:p-12 bg-gradient-to-br from-emerald-50 to-teal-50">
            <h1 className="text-4xl md:text-5xl font-black theme-text mb-4 leading-tight">{campaign.title}</h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">{campaign.description}</p>

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl shadow-sm border border-emerald-100">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Created By</p>
                  <p className="font-bold text-gray-800">{campaign.ownerName || 'Anonymous'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl shadow-sm border border-emerald-100">
                <div className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Deadline</p>
                  <p className="font-bold text-gray-800">{new Date(campaign.deadline).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-12">
              <div className="relative w-48 h-48 mx-auto md:mx-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="none" stroke="#f3f4f6" strokeWidth="3" />
                  <circle cx="18" cy="18" r="16" fill="none" stroke="url(#gradient)" strokeWidth="3" strokeDasharray={`${Math.min(progress, 100)} 100`} strokeLinecap="round" />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black theme-text">{Math.round(progress)}%</span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Funded</span>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">Total Raised</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-gray-800">₹{campaign.amountCollected.toLocaleString()}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">Target Goal</h3>
                  <span className="text-2xl font-bold text-teal-600">₹{campaign.goal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Donation Form */}
            {!isExpired ? (
              <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Support this cause</h2>
                <form onSubmit={handleDonate} className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-400">₹</span>
                    <input
                      type="number"
                      placeholder="Enter amount"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      className="w-full pl-10 pr-6 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-teal-100 focus:border-teal-500 outline-none transition-all text-xl font-bold outfit"
                      min="1"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isDonating}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black px-10 py-4 rounded-2xl shadow-xl shadow-teal-100 transform active:scale-95 transition-all text-lg whitespace-nowrap disabled:opacity-50"
                  >
                    {isDonating ? "Processing..." : "Donate Now"}
                  </button>
                </form>
                {!userId && <p className="mt-4 text-center text-sm text-red-500 font-medium italic">Please login to donate to this campaign.</p>}
              </div>
            ) : (
              <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-100 text-center font-bold text-xl">
                This campaign has reached its deadline.
              </div>
            )}
          </div>
        </div>

        {/* Donors List */}
        <div className="mt-12 bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-black text-gray-800 mb-8 border-b border-gray-100 pb-4">Community Support</h2>
          {donors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {donors.map((donor, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center font-bold text-gray-500">
                      {donor.donorName?.charAt(0) || 'A'}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{donor.donorName || 'Anonymous'}</p>
                      <p className="text-xs text-gray-400 capitalize">{new Date(donor.donatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black theme-text">₹{donor.amount.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="text-gray-300 mb-4 scale-150 transform">❤️</div>
              <p className="text-gray-500 font-medium">Be the first one to support this campaign!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
