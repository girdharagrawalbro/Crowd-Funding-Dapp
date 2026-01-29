"use client";
import { useState } from "react";
import { ethers } from "ethers";
import { contractAddress, contractABI } from "../lib/constants";
import { USE_MOCK_DATA, createMockCampaign, mockAccount } from "../lib/mockData";
import toast from 'react-hot-toast';
import Circle from "../components/Circle";
import { useDispatch } from 'react-redux';
import { createEvent } from '../store/slices/eventSlice';
import { useAccount } from 'wagmi';

export default function CreateCampaign() {
    const dispatch = useDispatch();
    const { address } = useAccount();
    const [form, setForm] = useState({
        title: "",
        description: "",
        goal: "",
        deadline: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const createCampaign = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const goalEth = parseFloat(form.goal);
            const deadlineDate = new Date(form.deadline);
            let campaignId;
            let txHash;

            if (USE_MOCK_DATA) {
                // Use mock data for demo
                const ownerAddress = address || mockAccount;
                const result = await createMockCampaign({
                    owner: ownerAddress,
                    title: form.title,
                    description: form.description,
                    goal: goalEth,
                    deadline: deadlineDate,
                });
                campaignId = result.campaign.id.toString();
                txHash = result.txHash;
                console.log("Mock campaign created:", result.campaign);
            } else {
                // Real blockchain transaction
                if (!window.ethereum) {
                    throw new Error("Please install MetaMask to create campaigns");
                }
                
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const contract = new ethers.Contract(contractAddress, contractABI, signer);
                
                const deadlineTimestamp = Math.floor(deadlineDate.getTime() / 1000);
                const tx = await contract.createCampaign(
                    form.title,
                    form.description,
                    ethers.parseEther(form.goal),
                    deadlineTimestamp
                );
                
                const receipt = await tx.wait();
                txHash = receipt.hash;
                
                // Get campaign count to determine new campaign ID
                const campaignCount = await contract.campaignCount();
                campaignId = (campaignCount - 1n).toString();
            }

            // Send to MongoDB API (optional - will fail gracefully if DB not set up)
            try {
                const response = await fetch("/api/events", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        blockchainId: campaignId,
                        title: form.title,
                        description: form.description,
                        goal: goalEth,
                        deadline: deadlineDate,
                        amountCollected: 0,
                        isWithdrawn: false
                    }),
                });
                
                if (response.ok) {
                    const campaignData = await response.json();
                    console.log("Campaign saved to database:", campaignData);
                }
            } catch (dbError) {
                console.log("Database save skipped (API may not be configured)");
            }

            // Dispatch createEvent action
            dispatch(createEvent({
                title: form.title,
                desc: form.description,
                endDate: deadlineDate,
                goal: goalEth,
                status: 'active',
                blockchainId: campaignId
            }));

            toast.success("Campaign Created Successfully!");
            setForm({
                title: "",
                description: "",
                goal: "",
                deadline: "",
            });
        } catch (error) {
            console.error("Error creating campaign:", error);
            toast.error(error.message || "Error creating campaign");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative min-h-screen py-6 px-4 sm:px-6 lg:px-8">
            <Circle />

            <div className="z-10 max-w-3xl mx-auto">
                <h1 className="text-2xl sm:text-3xl font-bold theme-text mb-4 sm:mb-6 text-center sm:text-left">
                    Create a Campaign
                </h1>

                <form onSubmit={createCampaign} className="border-2 border-blue-700 bg-white shadow-md rounded-lg px-4 sm:px-6 py-5 space-y-4 sm:space-y-6">
                    {/* Title Input */}
                    <div>
                        <label htmlFor="title" className="block text-sm sm:text-base font-medium text-gray-700">
                            Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            placeholder="Enter campaign title"
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                            required
                        />
                    </div>

                    {/* Description Input */}
                    <div>
                        <label htmlFor="description" className="block text-sm sm:text-base font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={form.description}
                            placeholder="Enter campaign description"
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                            rows="4"
                            required
                        />
                    </div>

                    {/* Goal Input */}
                    <div>
                        <label htmlFor="goal" className="block text-sm sm:text-base font-medium text-gray-700">
                            Goal (ETH)
                        </label>
                        <input
                            type="number"
                            name="goal"
                            value={form.goal}
                            placeholder="Enter goal amount in ETH"
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>

                    {/* Deadline Input */}
                    <div>
                        <label htmlFor="deadline" className="block text-sm sm:text-base font-medium text-gray-700">
                            Deadline
                        </label>
                        <input
                            type="datetime-local"
                            name="deadline"
                            value={form.deadline}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                            min={new Date().toISOString().slice(0, 16)}
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full border-2 border-blue-700 theme-bg text-blue-700 font-medium px-4 py-2 sm:py-2.5 rounded-full hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? 'Creating...' : 'Create Campaign'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}