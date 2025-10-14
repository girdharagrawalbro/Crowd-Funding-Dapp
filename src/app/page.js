"use client";
import { useEffect, useState } from "react";
import { fetchCampaigns } from "./lib/blockchain";
import Link from "next/link";
import toast from 'react-hot-toast';
import Image from 'next/image';
import { prisma } from './lib/prisma';

export default function Home() {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trandingfilteredCampaigns, settrandingFilteredCampaigns] = useState([]);

  
  useEffect(() => {
    setMounted(true);
    const loadCampaigns = async () => {
      try {
        const data = await fetchCampaigns();
        setCampaigns(data);
        setLoading(false);
      } catch (error) {
        console.error("Error loading campaigns:", error);
        toast.error("Error loading campaigns");
        setLoading(false);
      }
    };
    loadCampaigns();
  }, []);

  useEffect(() => {
    // Filter campaigns when campaigns data changes
    if (campaigns.length > 0) {
      const now = Math.floor(Date.now() / 1000); // Current timestamp in seconds
      const filtered = campaigns.filter(campaign =>
        campaign.deadline > now // Only show active campaigns
      );
      setFilteredCampaigns(filtered);
    }
  }, [campaigns]);

  useEffect(() => {
    // Filter out campaigns whose deadlines have passed
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const activeCampaigns = campaigns.filter(campaign => {
      const campaignDeadline = new Date(campaign.deadline);
      const deadlineDate = new Date(campaignDeadline.getFullYear(), campaignDeadline.getMonth(), campaignDeadline.getDate());
      return deadlineDate >= startOfToday;
    });
    // Sort campaigns by date added (assuming each campaign has a `dateAdded` field)  
    const sortedCampaigns = activeCampaigns.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));

    settrandingFilteredCampaigns(sortedCampaigns);
  }, [campaigns]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 5) % trandingfilteredCampaigns.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 5 + trandingfilteredCampaigns.length) % trandingfilteredCampaigns.length);
  };
  if (loading) return <div>Loading...</div>;

  const visibleCampaigns = trandingfilteredCampaigns.slice(currentIndex, currentIndex + 5);
  if (loading) {
    return (
      <div className="flex h-96 justify-center items-center py-60">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <>
      <section className={`main px-4 md:px-8 pb-8 ${mounted ? 'section-animate' : 'opacity-0'}`}>
        {/* Hero Content */}
        <div className="flex flex-col lg:flex-row items-center">
          {/* Logo - Shows on mobile but smaller */}
          <div className={`${mounted ? 'delayed-animate-1' : 'opacity-0'} mb-8 lg:mb-0`}>
            <Image
              src="/logo.png"
              alt="logo"
              className="logo mx-auto"
              width={300}
              height={300}
              priority
            />
          </div>

          {/* Text Content */}
          <div className={`flex flex-col gap-6 md:gap-10 pt-0 md:pt-4 jusify-center text-center items-center lg:items-center ${mounted ? 'delayed-animate-2' : 'opacity-0'} w-full lg:w-auto`}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl stroke-text leading-tight text-center">
              Your Contribution, Their Transformation.
            </h1>

            <div className={`flex flex-col gap-4 md:gap-5 ${mounted ? 'delayed-animate-3' : 'opacity-0'}`}>
              <h3 className="text-lg md:text-xl font-bold sub-text">
                Join Us in Turning Compassion Into Action
              </h3>
              <div className="text-white flex flex-col sm:flex-row gap-3 md:gap-4 items-center opacity-animate">
                <Link
                  href="/create"
                  className="w-full sm:w-48 md:w-56 lg:w-64 py-2 md:py-3 font-bold px-4 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 rounded-full transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
                >
                  Create Campaign
                </Link>
                <Link
                  href="#campaign"
                  className="w-full sm:w-48 md:w-56 lg:w-64 py-2 md:py-3 font-bold px-4 bg-gradient-to-r from-pink-500 to-pink-700 hover:from-pink-600 hover:to-pink-800 rounded-full transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
                >
                  Donate Funds
                </Link>
              </div>
            </div>
          </div>
        </div>


        {/* Stats Section */}
        <div className={`rounded border-green-800 border px-4 md:px-8 py-4 md:py-6 bg-white mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${mounted ? 'opacity-animate' : 'opacity-0'}`}>
          <div className="text-center sm:text-left">
            <h4 className="text-lg md:text-xl theme-text font-bold">
              Fundraise at a minimal platform fee.
            </h4>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 justify-center sm:justify-start">
            <Image src="/clock.png" alt="icon" width={24} height={24} className="text-green-500" />
            <h4 className="text-lg md:text-xl text-gray-600 font-bold text-center sm:text-left">
              Fast and Reliable Funds Disbursal
            </h4>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 justify-center sm:justify-start">
            <Image src="/people.png" alt="icon" width={24} height={24} className="text-green-500" />
            <h4 className="text-lg md:text-xl text-gray-600 font-bold text-center sm:text-left">
              Patients Successfully Supported
            </h4>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 justify-center sm:justify-start">
            <Image src="/charity.png" alt="icon" width={24} height={24} className="text-green-500" />
            <h4 className="text-lg md:text-xl text-gray-600 font-bold text-center sm:text-left">
              Countless Lives Positively Impacted
            </h4>
          </div>
        </div>
      </section>

      <section className={`mx-4 md:mx-8 my-6 border-2 relative border-green-500 rounded-lg px-4 md:px-8 py-3 text-center ${mounted ? 'section-animate' : 'opacity-0'}`}>
        <div className="halfCircle absolute left-0"></div>

        <h2 className="text-2xl md:text-3xl font-bold theme-text">Trending Fundraisers</h2>
        <h4 className="text-green-600 text-lg md:text-2xl my-2">
          View the fundraisers that are most active right now
        </h4>

        <div className="mt-4">
          <div className="flex flex-col md:flex-row text-center justify-center gap-4">
            {visibleCampaigns.length > 0 ? (
              visibleCampaigns.map((campaign, index) => (
                <div
                  key={index}
                  className="shadow-lg p-3 w-full flex flex-col md:flex-row items-center gap-4 justify-between border border-green-300 rounded-lg"
                >
                  {/* Progress Circle - Now on top for mobile */}
                  <div className="relative w-24 h-24 md:w-32 md:h-32">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path
                        className="text-gray-200"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="5"
                      />
                      <path
                        className="text-blue-600"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="5"
                        strokeDasharray={`${(campaign.amountCollected / campaign.goal) * 100}, 100`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-xs md:text-sm font-bold">
                        {((campaign.amountCollected / campaign.goal) * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>

                  {/* Campaign Info */}
                  <div className="flex-1 flex flex-col items-center md:items-start gap-1 md:gap-2">
                    <p className="text-lg md:text-2xl font-medium capitalize text-center md:text-left">
                      Funding for {campaign.title}
                    </p>
                    <p className="text-gray-600 text-sm md:text-xl">Raised</p>
                    <p className="text-lg md:text-2xl font-medium">
                      <span className="text-blue-500"> {campaign.amountCollected} ETH </span>
                      of {campaign.goal} ETH
                    </p>
                    <Link
                      href={`/campaign/${campaign.id}`}
                      className="bg-pink-600 hover:bg-pink-700 text-white py-1 md:py-2 px-3 md:px-4 rounded-full mt-1 md:mt-2 font-medium text-sm md:text-base transition-colors"
                    >
                      Donate Now
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full flex flex-col items-center justify-center py-8 text-center">
                <svg
                  className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mb-2 md:mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-xl md:text-2xl font-bold text-gray-600 mb-2 md:mb-4">
                  No trending campaigns found
                </p>
                <p className="text-gray-500 text-sm md:text-base max-w-md mx-auto">
                  All current campaigns have either ended or been successfully funded
                </p>
              </div>
            )}
          </div>

          {visibleCampaigns.length > 0 && campaigns.length > 1 && (
            <div className="flex justify-center gap-4 mt-4 md:mt-6">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className={`bg-green-600 text-white font-bold py-1 md:py-2 px-3 rounded-full ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'}`}
              >
                {"<"}
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex >= campaigns.length - itemsPerPage}
                className={`bg-green-600 text-white font-bold py-1 md:py-2 px-3 rounded-full ${currentIndex >= campaigns.length - itemsPerPage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'}`}
              >
                {">"}
              </button>
            </div>
          )}
        </div>

        <style jsx>{`
        @media (min-width: 768px) {
          .halfCircle {
            width: 100px;
            height: 200px;
            border-radius: 0 100px 100px 0;
            background-color: #CCFFD2;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
          }
        }
      `}</style>
      </section>


      <section id="campaign" className={`p-4 sm:p-6 ${mounted ? 'section-animate' : 'opacity-0'}`}>
        <div className="p-2 sm:p-6">
          <h1 className="font-bold main-text text-center mb-4 sm:mb-6 text-2xl sm:text-3xl">
            All Campaigns
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-4">
            {filteredCampaigns.length > 0 ? (
              filteredCampaigns.map((campaign, index) => {
                const progress = (campaign.amountCollected / campaign.goal) * 100;
                const isGoalMet = campaign.amountCollected >= campaign.goal;
                const deadlineDate = new Date(campaign.deadline * 1000);

                return (
                  <div
                    key={index}
                    className={`py-3 px-4 sm:py-4 sm:px-6 rounded-lg shadow-lg border-2 ${isGoalMet ? 'border-green-500' : 'border-blue-500'
                      }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex flex-col flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-xl sm:text-2xl font-medium capitalize line-clamp-1">
                            {campaign.title}
                          </p>
                          {isGoalMet && (
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap">
                              Goal Met!
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-base sm:text-lg mt-1 line-clamp-2">
                          {campaign.description}
                        </p>

                        <div className="grid grid-cols-2 gap-2 mt-2 sm:mt-3">
                          <div>
                            <p className="text-xs sm:text-sm text-gray-500">Goal</p>
                            <p className="text-base sm:text-lg font-medium">{campaign.goal} ETH</p>
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm text-gray-500">Collected</p>
                            <p className="text-base sm:text-lg font-medium">
                              {campaign.amountCollected} ETH
                            </p>
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm text-gray-500">Deadline</p>
                            <p className="text-base sm:text-lg">
                              {deadlineDate.toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm text-gray-500">Status</p>
                            <p className="text-base sm:text-lg">
                              {isGoalMet ? (
                                <span className="text-green-600">Funded</span>
                              ) : (
                                <span className="text-blue-600">Active</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto sm:ml-4">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                          <path
                            className="text-gray-200"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                          />
                          <path
                            className={isGoalMet ? 'text-green-500' : 'text-blue-500'}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeDasharray={`${progress}, 100`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <p className="text-base sm:text-lg font-bold">
                            {Math.round(progress)}%
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center mt-3 sm:mt-4">
                      <Link
                        href={`/campaign/${campaign.id}`}
                        className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white py-1.5 px-4 sm:py-2 sm:px-6 rounded-full text-sm sm:text-base"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-8 sm:py-12 text-center">
                <svg
                  className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mb-2 sm:mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-xl sm:text-2xl font-bold text-gray-600 mb-2 sm:mb-4">
                  No active campaigns found
                </p>
                <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">
                  All current campaigns have either ended or been successfully funded
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

    </>
  );
}