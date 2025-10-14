"use client";

export default function DonationCard({ donation, onRefund }) {
  const progress = (donation.amountCollected / donation.goal) * 100;
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold mb-2">{donation.title}</h3>
      
      <div className="mb-2">
        <span className="font-medium">Your donation: </span>
        {donation.amount.toFixed(5)} ETH
      </div>
      
      <div className="mb-2">
        <span className="font-medium">Goal: </span>
        {donation.goal.toFixed(5)} ETH
      </div>
      
      <div className="mb-2">
        <span className="font-medium">Raised: </span>
        {donation.amountCollected.toFixed(5)} ETH
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div 
          className="bg-blue-500 h-2.5 rounded-full" 
          style={{ width: `${Math.min(progress, 100)}%` }}
        ></div>
      </div>
      
      <div className="mb-4">
        <span className="font-medium">Deadline: </span>
        {donation.deadline.toLocaleDateString()}
        {donation.isEnded && ' (Ended)'}
      </div>
      
      <div className="mb-4">
        <span className="font-medium">Status: </span>
        {donation.isSuccessful ? (
          <span className="text-blue-600">Successful</span>
        ) : donation.isEligibleForRefund ? (
          <span className="text-red-600">Eligible for refund</span>
        ) : (
          <span>Active</span>
        )}
      </div>
      
      {donation.isEligibleForRefund && (
        <button 
          onClick={() => onRefund(donation.id)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded w-full text-sm"
        >
          Request Refund
        </button>
      )}
    </div>
  );
}