"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast from 'react-hot-toast';
import { fetchCampaign, donateToCampaign } from "../../lib/blockchain";
import Circle from "../../components/Circle";

export default function CampaignDetails() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [donation, setDonation] = useState("");
  const [donors, setDonors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [account, setAccount] = useState("");
  const [isDonating, setIsDonating] = useState(false);
  const [hasDonated, setHasDonated] = useState(false);

  // Fetch campaign from blockchain
  useEffect(() => {
    const loadCampaign = async () => {
      try {
        const data = await fetchCampaign(id);
        setCampaign(data);
      } catch (error) {
        console.error("Error fetching campaign:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCampaign();
  }, [id]);

  // Fetch donors from MongoDB
  useEffect(() => {
    const fetchDonorsFromDB = async () => {
      try {
        const res = await fetch(`/api/campaign/${id}/donors`);
        const data = await res.json();
        setDonors(data.donors || []);
      } catch (err) {
        console.error("Error loading donors from DB:", err);
      }
    };
    fetchDonorsFromDB();
  }, [id]);

  // Check if current user donated (account address match)
  useEffect(() => {
    const checkIfUserHasDonated = async () => {
      if (!account) return;
      try {
        const res = await fetch(`/api/campaign/${id}/has-donated?account=${account}`);
        const data = await res.json();
        setHasDonated(data.hasDonated);
      } catch (err) {
        console.error("Error checking donor status:", err);
      }
    };
    checkIfUserHasDonated();
  }, [account, id]);

  // Get connected account (if using MetaMask or WalletConnect)
  useEffect(() => {
    const getAccount = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]);
      }
    };
    getAccount();
  }, []);

  const handleDonate = async () => {
    if (!donation || isNaN(donation) || parseFloat(donation) <= 0) {
      toast.error('Please enter a valid donation amount.');
      return;
    }

    setIsDonating(true);
    try {
      const result = await donateToCampaign(id, donation);
      if (result.success) {
        toast.success("Donation successful!");
        const updatedCampaign = await fetchCampaign(id);
        setCampaign(updatedCampaign);
        const updatedDonors = await fetch(`/api/campaign/${id}/donors`).then(res => res.json());
        setDonors(updatedDonors.donors || []);
        setHasDonated(true);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred while donating. Please try again.");
    } finally {
      setIsDonating(false);
    }
  };

  if (isLoading) {
    return <div className="flex h-96 justify-center items-center py-60">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>;
  }

  if (!campaign) {
    return <div className="flex h-96 justify-center items-center py-60">
      <p className="text-center mt-8 text-bold text-2xl">Campaign not found.</p>
    </div>;
  }

  const isDeadlinePassed = new Date() > new Date(campaign.deadline * 1000);
  const isGoalAcheived = campaign.amountCollected >= campaign.goal;

  return (
    <div className="relative min-h-screen py-2">
      <Circle />
      <div className="z-10 p-5 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 capitalize theme-text">{campaign.title}</h1>
        <p className="text-xl mb-4">{campaign.description}</p>

        <div className="px-6 py-3 rounded-lg flex items-center gap-8 justify-center shadow-md mb-6 border-2 border-green-600">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path className="text-gray-200" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="5" />
              <path className="text-blue-600" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="5" strokeDasharray={`${(campaign.amountCollected / campaign.goal) * 100}, 100`} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-sm font-bold">{((campaign.amountCollected / campaign.goal) * 100).toFixed(2)}%</p>
            </div>
          </div>
          <div className="flex flex-col">
            <p className="text-2xl font-medium capitalize">Funding for {campaign.title}</p>
            <p className="text-gray-600 text-lg">Raised</p>
            <p className="text-2xl font-medium">
              <span className="text-blue-500"> {campaign.amountCollected} ETH </span> of {campaign.goal} ETH
            </p>
            <p className="text-lg text-red-400">Deadline: {new Date(campaign.deadline * 1000).toLocaleString()}</p>
          </div>
        </div>

        {!isGoalAcheived && !isDeadlinePassed && !hasDonated ? (
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-4 theme-text">Donate to this Campaign</h2>
            <div className="flex items-center gap-4">
              <input
                type="number"
                placeholder="ETH amount"
                value={donation}
                onChange={(e) => setDonation(e.target.value)}
                className="border-2 border-green-600 py-2 px-4 rounded-full flex-1"
                min="0"
                step="0.01"
              />
              <button
                onClick={handleDonate}
                disabled={isDonating}
                className="bg-gradient-to-r from-pink-500 to-pink-700 hover:from-pink-600 hover:to-pink-800 text-white px-6 py-2 rounded-full disabled:bg-pink-300"
              >
                {isDonating ? "Donating..." : "Donate Now"}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6">
            {hasDonated && <p className="text-green-600 text-lg">You already donated to this campaign.</p>}
            {isGoalAcheived && <h6 className="text-green-600 text-xl font-medium">Campaign completed successfully!</h6>}
            {isDeadlinePassed && <h6 className="text-red-500 text-xl font-medium">Campaign has ended.</h6>}
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 theme-text">Previous Donors</h2>
          <div className="px-6 py-3 rounded-lg border-2 border-green-600 shadow-lg">
            {donors.length > 0 ? (
              <ul className="list-disc pl-6">
                {donors.map((donor, index) => (
                  <li key={index} className="text-gray-600">{donor.account}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 text-xl font-medium">No donations yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
