"use client";

import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

export default function AdminCampaignApprovalPage() {
  const { walletAddress } = useSelector((state) => state.account);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const loadPendingCampaigns = useCallback(async () => {
    if (!walletAddress) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/campaigns/pending", {
        headers: {
          "x-admin-wallet": walletAddress,
        },
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load pending campaigns");
      }

      setCampaigns(data);
    } catch (error) {
      toast.error(error.message || "Failed to load pending campaigns");
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    loadPendingCampaigns();
  }, [loadPendingCampaigns]);

  const reviewCampaign = async (campaign, action) => {
    setActionId(campaign.mongoId);
    try {
      const route = action === "approve" ? "approve" : "reject";
      const res = await fetch(`/api/admin/campaigns/${campaign.mongoId}/${route}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-wallet": walletAddress,
        },
        body: JSON.stringify({
          adminWallet: walletAddress,
          note: action === "approve" ? "Approved by admin" : "Rejected by admin",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `Failed to ${action} campaign`);
      }

      toast.success(`Campaign ${action}d successfully`);
      setCampaigns((prev) => prev.filter((item) => item.mongoId !== campaign.mongoId));
    } catch (error) {
      toast.error(error.message || `Failed to ${action} campaign`);
    } finally {
      setActionId(null);
    }
  };

  if (!walletAddress) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Admin Campaign Approval</h1>
        <p className="text-gray-600">Connect your admin wallet to review campaigns.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Admin Campaign Approval</h1>
        <p>Loading pending campaigns...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Admin Campaign Approval</h1>
      <p className="text-gray-600 mb-8">Review campaigns before they go live for donations.</p>

      {campaigns.length === 0 ? (
        <div className="border rounded-lg p-6 bg-white shadow-sm">
          <p className="text-gray-600">No pending campaigns to review.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <div key={campaign.mongoId} className="border rounded-lg p-5 bg-white shadow-sm">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">{campaign.title}</h2>
                  <p className="text-gray-700 mt-2">{campaign.description}</p>
                  <div className="mt-3 text-sm text-gray-600 space-y-1">
                    <p>Owner: {campaign.ownerWallet}</p>
                    <p>Goal: {campaign.goal} ETH</p>
                    <p>Deadline: {new Date(campaign.deadline).toLocaleString()}</p>
                    <p>Blockchain Campaign ID: {campaign.blockchainId || "Not set"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => reviewCampaign(campaign, "approve")}
                    disabled={actionId === campaign.mongoId}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-60"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => reviewCampaign(campaign, "reject")}
                    disabled={actionId === campaign.mongoId}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded disabled:opacity-60"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
