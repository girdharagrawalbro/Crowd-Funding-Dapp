"use client";
import { useState } from "react";
import { ethers } from "ethers";
import { contractAddress, contractABI } from "../lib/constants";
import toast, { Toaster } from 'react-hot-toast';

// components
import Header from '../components/Header';

export default function CreateCampaign() {
    const [account, setAccount] = useState({});

    const [form, setForm] = useState({
        title: "",
        description: "",
        goal: "",
        deadline: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const createCampaign = async (e) => {
        e.preventDefault();
        if (!window.ethereum) {
            return toast.error("Install Metamask!");
        }

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, contractABI, signer);

            const tx = await contract.createCampaign(
                form.title,
                form.description,
                ethers.parseEther(form.goal),
                Math.floor(new Date(form.deadline).getTime() / 1000)
            );

            await tx.wait();
            toast.error("Campaign Created!");
        } catch (error) {
            console.error("Error creating campaign:", error);
            toast.error("Error creating campaign:", error);
        }
    };

    return (
        <>
            <Header setAccount={setAccount} />
            <div className="bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-2xl font-bold theme-text mb-4">Create a Campaign</h1>
                    <form onSubmit={createCampaign} className="border-3 border-green-700 bg-white shadow-md rounded-lg px-6 py-5         space-y-6">
                        {/* Title Input */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium">
                                Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                placeholder="Enter campaign title"
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        {/* Description Input */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium">
                                Description
                            </label>
                            <textarea
                                name="description"
                                placeholder="Enter campaign description"
                                onChange={handleChange}
                                rows="2"
                                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        {/* Goal Input */}
                        <div>
                            <label htmlFor="goal" className="block text-sm font-medium">
                                Goal (ETH)
                            </label>
                            <input
                                type="number"
                                name="goal"
                                placeholder="Enter funding goal in ETH"
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                step="0.0001"  // Add this to allow small decimal values
                                required
                            />
                        </div>

                        {/* Deadline Input */}
                        <div>
                            <label htmlFor="deadline" className="block text-sm font-medium">
                                Deadline
                            </label>
                            <input
                                type="datetime-local"
                                name="deadline"
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                className="w-full border border-green-700 theme-bg text-green-600 font-medium px-4 py-2 rounded-full hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            >
                                Create Campaign
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
        </>
    );
}