import { ethers } from "ethers";
import { contractAddress, contractABI } from "./constants";

// to get ethereumContract
const getEthereumContract = async () => {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(contractAddress, contractABI, signer);
  }
};

// to fetch all camoaigns
export const fetchCampaigns = async () => {
  try {
    const contract = await getEthereumContract();
    const campaignCount = await contract.getNumberOfCampaigns();
    let campaigns = [];

    for (let i = 0; i < campaignCount; i++) {
      const campaign = await contract.getCampaign(i);
      campaigns.push({
        id: i, // Add campaign ID for reference
        owner: campaign[0],
        title: campaign[1],
        description: campaign[2],
        goal: ethers.formatEther(campaign[3]), // Convert from wei to ETH
        deadline: Number(campaign[4]), // Keep as timestamp for calculations
        amountCollected: ethers.formatEther(campaign[5]), // Convert from wei to ETH
      });
    }

    return campaigns;
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    throw new Error("Failed to fetch campaigns. Please try again."); // Rethrow for better error handling
  }
};

// to donate to campaign
export const donateToCampaign = async (campaignId, amount) => {
  try {
    const contract = await getEthereumContract();
    const tx = await contract.donateToCampaign(campaignId, { value: ethers.parseEther(amount) });
    await tx.wait();
    return { success: true };
  } catch (error) {
    console.error("Error donating:", error);
    return { success: false, message: error.reason };
  }
};

//  to withdraw a fund
export const withdrawFunds = async (campaignId) => {
  try {
    const contract = await getEthereumContract();
    const tx = await contract.withdrawFunds(campaignId);
    await tx.wait();
    return { success: true, message: "Funds withdrawn successfully!" };
  } catch (error) {
    // console.error("Error withdrawing funds:", error);
    return { success: false, message: error.reason };
  }
};

//  to fetch a single campaign
export const fetchCampaign = async (campaignId) => {
  try {
    const contract = await getEthereumContract();
    const campaign = await contract.getCampaign(campaignId);
    return {
      owner: campaign[0],
      title: campaign[1],
      description: campaign[2],
      goal: ethers.formatEther(campaign[3]),
      deadline: Number(campaign[4]),
      amountCollected: ethers.formatEther(campaign[5]),
    };
  } catch (error) {
    console.error("Error fetching campaign:", error);
    return null;
  }
};

//  to fetch doners
export const fetchDonors = async (campaignId) => {
  try {
    const contract = await getEthereumContract();
    const donors = await contract.getDonors(campaignId);
    return donors;
  } catch (error) {
    console.error("Error fetching donors:", error);
    throw new Error("Failed to fetch donors. Please try again."); // Rethrow for better error handling
  }
};

//  to fetch doner with donations
export const fetchDonorsWithDonations = async (campaignId) => {
  try {
    const contract = await getEthereumContract();
    const donors = await contract.getDonors(campaignId);
    const donorsWithDonations = await Promise.all(
      donors.map(async (donor) => {
        const donationAmount = await contract.getDonationAmount(campaignId, donor);
        return {
          address: donor,
          amount: ethers.formatEther(donationAmount), // Convert from wei to ETH
        };
      })
    );
    return donorsWithDonations;
  } catch (error) {
    console.error("Error fetching donors with donations:", error);
    throw new Error("Failed to fetch donors. Please try again.");
  }
};