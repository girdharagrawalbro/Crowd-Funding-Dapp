"use client"
import { useEffect, useState } from "react";
import { fetchCampaigns, donateToCampaign } from "./lib/blockchain";
import { withdrawFunds } from "./lib/blockchain";
import Link from "next/link";
import toast, { Toaster } from 'react-hot-toast';
import Header from './components/Header';

export default function Home() {
  const [campaigns, setCampaigns] = useState([]);
  const [account, setAccount] = useState({});

  useEffect(() => {
    const loadCampaigns = async () => {
      const data = await fetchCampaigns();
      setCampaigns(data);
    };
    loadCampaigns();
  }, []);

  const handleWithdraw = async (index) => {
    try {
      const result = await withdrawFunds(index);
      if (result.success) {
        toast.success(result.message);
        window.location.reload();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      // Extract the error message from the error object
      const errorMessage = error.reason || "An error occurred during withdrawal.";
      toast.error(errorMessage);
    }
  };
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);

  useEffect(() => {
    // Filter out campaigns whose deadlines have passed
    const now = new Date();
    const activeCampaigns = campaigns.filter(campaign => new Date(campaign.deadline) > now);

    // Sort campaigns by date added (assuming each campaign has a `dateAdded` field)
    const sortedCampaigns = activeCampaigns.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));

    setFilteredCampaigns(sortedCampaigns);
  }, [campaigns]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 5) % filteredCampaigns.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 5 + filteredCampaigns.length) % filteredCampaigns.length);
  };

  const visibleCampaigns = filteredCampaigns.slice(currentIndex, currentIndex + 5);

  return (
    <>
      <Header setAccount={setAccount} />

      <section className="main px-8 pb-5.5">
        <div className="flex">
          <div>
            <img src="logo.png" alt="logo" className="logo" width="550px" height="550px" />
          </div>
          <div className="flex flex-col gap-10 pt-4 text-center items-center justify-center">
            <h1 className="text-7xl stroke-text">Your Contribution, Their Transformation.</h1>
            <div className="flex flex-col gap-5">
            <h3 className="text-xl font-bold sub-text">Join Us in Turning Compassion Into Action</h3>
            <div className="text-white flex gap-2 items-center">
              <button className="w-64  py-3 font-bold px-4 bg-fuchsia-600 rounded-full">Create Campaign</button>
              <button className="w-64 py-3 font-bold px-4 bg-pink-600 rounded-full">Donate Funds</button>
            </div>
            </div>
          </div>
        </div>
        <div className="flex rounded border-green-800 border px-8 justify-center py-7 gap-8  bg-white">
          <h4 className="text-xl font-bold">Fundraise at a minimal platform fee.</h4>
          <h4 className="text-xl font-bold">Fast and Reliable Funds Disbursal</h4>
          <h4 className="text-xl font-bold">Patients Successfully Supported</h4>
          <h4 className="text-xl font-bold">Countless Lives Positively Impacted</h4>
        </div>
      </section >

      <section className="mx-8 my-6 border-3 border-green-600 rounded-lg px-8 py-3 text-center">
        <h2 className="text-3xl font-bold theme-text">Trending Fundraisers</h2>
        <h4 className="text-green-600 text-2xl my-2">View the fundraisers that are most active right now</h4>
        <div className="mt-4">
          <div className="flex text-center justify-center">
            {visibleCampaigns.length > 0 ? (
              visibleCampaigns.map((campaign, index) => (
                <div key={index} className="shadow-lg p-3 my-3 w-full flex items-center gap-4 justify-center border border-green-300 rounded">
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
                    <Link href={`/campaign/${index}`} className="bg-pink-600 text-white py-2 px-4 rounded-full mt-2 block font-medium">
                      Donate Now
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-bold text-xl">No tranding campaigns found.</p>
            )}
          </div>
          {visibleCampaigns.length > 0 ? (
            <div className="flex justify-between mt-4">
              <button onClick={handlePrevious} className="bg-green-600 text-white font-bold py-2 px-3 rounded-full mr-2">
                {"<"}
              </button>
              <button onClick={handleNext} className="bg-green-600 text-white py-2 px-3 rounded-full font-bold">
                {">"}
              </button>
            </div>
          ) : <></>}
        </div>
      </section>

      <section>
        <div className=" p-6">
          <h1 className="font-bold main-text text-center mb-6 text-3xl">All Campaigns</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {campaigns.length > 0 ? (
              campaigns.map((campaign, index) => (

                <div key={index} className="py-2 px-5 rounded-lg shadow-lg border-3 border-green-600 ">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">


                      <p className="text-2xl font-medium capitalize">{campaign.title}</p>
                      <p className="text-gray-600 text-xl">{campaign.description}</p>

                      <p className="text-lg">Goal: {campaign.goal} ETH</p>
                      <p className="text-lg">Collected: {campaign.amountCollected} ETH</p>
                      <p className="text-lg text-red-500">Deadline:{new Date(campaign.deadline * 1000).toLocaleString()}</p>

                    </div>

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
                  </div>
                  <div className="flex justify-around items-center">
                    <Link href={`/campaign/${index}`} className="bg-blue-500 text-white py-2 px-4 rounded-full mt-2 block">
                      View Details
                    </Link>

                    {account === campaign.owner && (
                      <button onClick={() => handleWithdraw(index)} className="bg-pink-600 text-white px-4 py-2 mt-2 rounded-full">
                        Withdraw Funds
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-2xl text-bold">No campaigns found.</p>
            )}
          </div>
        </div>
      </section>


    </>
  );
}