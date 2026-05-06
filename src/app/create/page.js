"use client";
import { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import Circle from "../components/Circle";
import { createEvent } from '../store/slices/eventSlice';
import { useRouter } from 'next/navigation';

export default function CreateCampaign() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { userId, name: userName } = useSelector(state => state.account);
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
        
        if (!userId) {
            toast.error("Please login first to create a campaign");
            return;
        }

        setIsSubmitting(true);

        try {
            const goalAmount = parseFloat(form.goal);
            const deadlineDate = new Date(form.deadline);

            await dispatch(createEvent({
                title: form.title,
                description: form.description,
                goal: goalAmount,
                deadline: deadlineDate,
                amountCollected: 0,
                isWithdrawn: false,
                ownerId: userId,
                ownerName: userName,
                status: 'Active'
            })).unwrap();

            toast.success("Campaign created successfully!");
            router.push('/creator-dashboard');
        } catch (error) {
            console.error("Error creating campaign:", error);
            toast.error(error.message || "Error creating campaign");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!userId) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold text-gray-600">Please login to create a campaign</h2>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen py-6 px-4 sm:px-6 lg:px-8">
            <Circle />

            <div className="z-10 max-w-3xl mx-auto">
                <h1 className="text-2xl sm:text-3xl font-bold theme-text mb-4 sm:mb-6 text-center sm:text-left">
                    Create a Campaign
                </h1>

                <form onSubmit={createCampaign} className="border-3 border-green-700 bg-white shadow-md rounded-lg px-4 sm:px-6 py-5 space-y-4 sm:space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm sm:text-base font-medium text-gray-700">
                            Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            placeholder="e.g. Medical Emergency Help"
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base outfit"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm sm:text-base font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={form.description}
                            placeholder="Describe why you need funds..."
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base outfit"
                            rows="4"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="goal" className="block text-sm sm:text-base font-medium text-gray-700">
                            Goal Amount (₹)
                        </label>
                        <input
                            type="number"
                            name="goal"
                            value={form.goal}
                            placeholder="Enter amount in Rupee"
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base outfit"
                            min="1"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="deadline" className="block text-sm sm:text-base font-medium text-gray-700">
                            Deadline
                        </label>
                        <input
                            type="datetime-local"
                            name="deadline"
                            value={form.deadline}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base outfit"
                            min={new Date().toISOString().slice(0, 16)}
                            required
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold px-6 py-3.5 rounded-xl hover:from-emerald-600 hover:to-teal-700 shadow-lg transform active:scale-95 transition-all duration-200 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? 'Creating...' : 'Launch Campaign'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}