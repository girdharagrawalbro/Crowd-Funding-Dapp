"use client";
import { ethers } from 'ethers';

export default function CampaignCard({ campaign, onWithdraw, onShowDonors }) {
  const progress = (campaign.amountCollected / campaign.goal) * 100;
  const isActive = new Date() < campaign.deadline;
  const canWithdraw = !isActive && campaign.amountCollected >= campaign.goal;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold mb-2">{campaign.title}</h3>
      <p className="text-gray-600 mb-4 line-clamp-2">{campaign.description}</p>
      
      <div className="mb-2">
        <span className="font-medium">Goal: </span>
        {campaign.goal.toFixed(5)} ETH
      </div>
      
      <div className="mb-2">
        <span className="font-medium">Raised: </span>
        {campaign.amountCollected.toFixed(5)} ETH
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div 
          className="bg-blue-500 h-2.5 rounded-full" 
          style={{ width: `${Math.min(progress, 100)}%` }}
        ></div>
      </div>
      
      <div className="mb-4">
        <span className="font-medium">Deadline: </span>
        {campaign.deadline.toLocaleDateString()}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {canWithdraw && (
          <button 
            onClick={() => onWithdraw(campaign.id)}
            className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-4 py-2 rounded text-sm"
          >
            Withdraw
          </button>
        )}
        <button 
          onClick={() => onShowDonors(campaign.id)}
          className="bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800 text-white px-4 py-2 rounded text-sm"
        >
          View Donors
        </button>
      </div>
    </div>
  );
}