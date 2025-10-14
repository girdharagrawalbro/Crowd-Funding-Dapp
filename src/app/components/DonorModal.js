"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contactABI, contractAddress } from '../lib/constants';

export default function DonorModal({ isOpen, onClose, donors, campaign }) {
  const [donationAmounts, setDonationAmounts] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDonationAmounts = async () => {
      if (!isOpen || donors.length === 0) return;

      setLoading(true);
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(
          process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
          contractABI,
          signer
        );

        const amounts = {};
        for (const donor of donors) {
          const amount = await contract.getDonationAmount(campaign.id, donor);
          amounts[donor] = parseFloat(ethers.formatEther(amount));
        }
        setDonationAmounts(amounts);
      } catch (error) {
        console.error("Error fetching donation amounts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonationAmounts();
  }, [isOpen, donors, campaign?.id]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-30 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md sm:max-w-2xl max-h-[90vh] sm:max-h-[80vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h3 className="text-xl sm:text-2xl font-bold">
              Donors for {campaign?.title}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl focus:outline-none"
              aria-label="Close modal"
            >
              &times;
            </button>
          </div>

          <div className="mb-3 sm:mb-4">
            <p className="text-sm sm:text-base font-medium">
              Total donors: {donors.length}
            </p>
            <p className="text-sm sm:text-base font-medium">
              Total raised: {campaign?.amountCollected.toFixed(5)} ETH
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="space-y-1 sm:space-y-2">
              {donors.length === 0 ? (
                <p className="text-gray-600 text-sm sm:text-base text-center py-4">
                  No donors yet
                </p>
              ) : (
                donors.map((donor, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2 sm:p-3 border-b text-xs sm:text-sm"
                  >
                    <span className="font-mono truncate max-w-[150px] sm:max-w-none">
                      {donor.substring(0, 6)}...{donor.substring(donor.length - 4)}
                    </span>
                    <span className="text-gray-600 whitespace-nowrap">
                      {donationAmounts[donor]?.toFixed(5) || '0.0000'} ETH
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}