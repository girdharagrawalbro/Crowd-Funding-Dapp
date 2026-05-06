"use client";

import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Circle from "../components/Circle";

export default function AdminCampaignApprovalPage() {
  const { userId, name: userName } = useSelector((state) => state.account);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  // For demo purposes, we'll assume any logged in user can view this, 
  // but in a real app, you'd check an 'isAdmin' flag on the user object.
  const isAdmin = true;

  const loadPendingCampaigns = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/campaigns/pending", {
        headers: {
          "x-admin-id": userId,
        },
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load pending campaigns");
      }

      setCampaigns(data);
    } catch (error) {
      // If the API isn't ready, show empty state
      console.error(error);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadPendingCampaigns();
  }, [loadPendingCampaigns]);

  const reviewCampaign = async (campaign, action) => {
    const mongoId = campaign._id || campaign.mongoId || campaign.id;
    setActionId(mongoId);
    try {
      const route = action === "approve" ? "approve" : "reject";
      const res = await fetch(`/api/admin/campaigns/${mongoId}/${route}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-id": userId,
        },
        body: JSON.stringify({
          adminId: userId,
          adminName: userName,
          note: action === "approve" ? "Approved by admin" : "Rejected by admin",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `Failed to ${action} campaign`);
      }

      toast.success(`Campaign ${action}d successfully`);
      setCampaigns((prev) => prev.filter((item) => (item._id || item.mongoId || item.id) !== mongoId));
    } catch (error) {
      toast.error(error.message || `Failed to ${action} campaign`);
    } finally {
      setActionId(null);
    }
  };

  if (!userId) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Circle />
        <h1 className="text-3xl font-black theme-text mb-4">Admin Hub</h1>
        <p className="text-gray-500 font-medium">Please login with an admin account to review campaigns.</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen py-10 px-4">
      <Circle />
      <div className="max-w-5xl mx-auto z-10 relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black theme-text mb-2">Campaign Approvals</h1>
            <p className="text-gray-500 font-medium">Review pending grassroots movements before they go live.</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-emerald-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04 escape 1.118-2.137A9 9 0 1120.882 7.823l-1.264 4.172z" /></svg>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Admin</p>
              <p className="font-bold text-gray-800">{userName}</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-100 shadow-sm">
            <div className="text-5xl mb-4">✨</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">All Caught Up!</h2>
            <p className="text-gray-500">There are no pending campaigns requiring your review right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {campaigns.map((campaign) => {
              const campaignId = campaign._id || campaign.mongoId || campaign.id;
              return (
                <div key={campaignId} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex flex-col lg:flex-row justify-between gap-8">
                    <div className="flex-1">
                      <div className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-[10px] font-black uppercase tracking-widest mb-4">
                        Pending Approval
                      </div>
                      <h2 className="text-2xl font-black text-gray-800 mb-3">{campaign.title}</h2>
                      <p className="text-gray-500 leading-relaxed mb-6">{campaign.description}</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Target</p>
                          <p className="font-bold text-gray-800">₹{campaign.goal?.toLocaleString()}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Deadline</p>
                          <p className="font-bold text-gray-800">{new Date(campaign.deadline).toLocaleDateString()}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 col-span-2">
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Creator</p>
                          <p className="font-bold text-gray-800 truncate">{campaign.ownerName || 'Anonymous'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row lg:flex-col gap-3 min-w-[200px]">
                      <button
                        onClick={() => reviewCampaign(campaign, "approve")}
                        disabled={actionId === campaignId}
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-teal-100 transform active:scale-95 transition-all text-sm uppercase tracking-widest disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => reviewCampaign(campaign, "reject")}
                        disabled={actionId === campaignId}
                        className="flex-1 bg-white hover:bg-red-50 text-red-500 border-2 border-red-100 font-black py-4 rounded-2xl transform active:scale-95 transition-all text-sm uppercase tracking-widest disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
