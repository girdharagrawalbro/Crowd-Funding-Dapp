"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';
import { fetchCampaign, donateToCampaign, fetchDonors, fetchDonorsWithDonations } from "../../lib/blockchain";
import Header from '../../components/Header';

export default function CampaignDetails() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [donation, setDonation] = useState("");
  const [donors, setDonors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [account, setAccount] = useState({});
  const [isDonating, setIsDonating] = useState(false);

  // Fetch campaign details
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

  // Fetch donors list
  useEffect(() => {
    const loadDonors = async () => {
      try {
        const donorList = await fetchDonors(id);
        setDonors(donorList);
      } catch (error) {
        console.error("Error fetching donors:", error);
      }
    };
    loadDonors();
  }, [id]);

  // Fetch donors list with donations
  useEffect(() => {
    const loadDonors = async () => {
      try {
        const donors = await fetchDonorsWithDonations(id);
        console.log("Donors with Donations:", donors);
      } catch (error) {
        console.error(error.message);
      }
    };
    loadDonors();
  }, [id]);

  // Handle donation
  const handleDonate = async () => {
    if (!donation || isNaN(donation) || parseFloat(donation) <= 0) {
      toast.error('Please enter a valid donation amount.')
      return;
    }

    setIsDonating(true);

    try {
      const result = await donateToCampaign(id, donation);
      if (result.success) {
        toast.success("Donation successful!");
        // Refresh campaign and donors data
        const updatedCampaign = await fetchCampaign(id);
        setCampaign(updatedCampaign);
        const updatedDonors = await fetchDonors(id);
        setDonors(updatedDonors);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Error donating:", error);
      toast.error("An error occurred while donating. Please try again.");
    } finally {
      setIsDonating(false);
    }
  };

  if (isLoading) {
    return <p className="text-center mt-8 text-bold text-2xl ">Loading campaign details...</p>;
  }

  if (!campaign) {
    return <p className="text-center mt-8 text-bold text-2xl ">Campaign not found.</p>;
  }

  const isDeadlinePassed = new Date() > new Date(campaign.deadline * 1000);

  return (
    <>
      <Header setAccount={setAccount} />

      <div className="p-5 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 capitalize theme-text">{campaign.title}</h1>
        <p className="text-xl mb-4">{campaign.description}</p>

        <div className=" px-6 py-3 rounded-lg flex items-center gap-8 justify-center shadow-md mb-6 border-3 border-green-700">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              {/* Background circle */}
              <path
                className="text-gray-200"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
              />
              {/* Progress circle */}
              <path
                className="text-blue-600"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
                strokeDasharray={`${(campaign.amountCollected / campaign.goal) * 100}, 100`}
                strokeLinecap=""
              />
            </svg>
            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-sm font-bold">
                {((campaign.amountCollected / campaign.goal) * 100)}%
              </p>
            </div>
          </div>
          <div className="flex flex-col">
            <p className="text-2xl font-medium capitalize">Funding for {campaign.title}</p>
            <p className="text-gray-600 text-xl">Raised</p>
            <p className="text-2xl font-medium"><span className="text-blue-500"> {campaign.amountCollected} ETH </span> of {campaign.goal} ETH</p>
            <p className="text-xl text-red-400">Deadline: {new Date(campaign.deadline * 1000).toLocaleString()}</p>
          </div>
        </div>

        { !isDeadlinePassed ? (
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-4 theme-text">Donate to this Campaign</h2>
            <div className="flex items-center gap-4">
              <input
                type="number"
                placeholder="ETH amount"
                value={donation}
                onChange={(e) => setDonation(e.target.value)}
                className="border-2 border-green-700 py-2 px-4 rounded-full flex-1"
                min="0"
                step="0.01"
              />
              <button
                onClick={handleDonate}
                disabled={isDonating}
                className="bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 disabled:bg-pink-300"
              >
                {isDonating ? "Donating..." : "Donate Now"}
              </button>
            </div>
          </div>
        ) :
          (

            <h6 class="text-red-500 text-xl font-medium">The Campaign is not active </h6>
          )

        }

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 theme-text">Previous Doners</h2>
          <div className="px-6 py-3 rounded-lg border-3 border-green-700">
          {donors.length > 0 ? (
            <ul className="list-disc pl-6">
              {donors.map((donor, index) => (
                <li key={index} className="text-gray-600">{donor}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 text-xl font-medium">No donations yet.</p>
          )}
        </div>
        </div>

      </div>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </>
  );
}