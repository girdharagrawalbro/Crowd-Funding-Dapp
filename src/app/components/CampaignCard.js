"use client";

export default function CampaignCard({ campaign, onWithdraw, onShowDonors }) {
  const progress = (campaign.amountCollected / campaign.goal) * 100;
  const isActive = new Date() < new Date(campaign.deadline);
  const canWithdraw = !isActive && campaign.amountCollected >= campaign.goal;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-2xl font-bold mb-2 theme-text truncate">{campaign.title}</h3>
      <p className="text-gray-500 mb-6 line-clamp-2 min-h-[3rem]">{campaign.description}</p>
      
      <div className="flex justify-between items-end mb-4">
        <div>
          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Target</p>
          <p className="text-xl font-bold text-gray-800">₹{Number(campaign.goal).toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Raised</p>
          <p className="text-xl font-bold theme-text">₹{Number(campaign.amountCollected).toLocaleString()}</p>
        </div>
      </div>
      
      <div className="w-full bg-gray-100 rounded-full h-3 mb-6 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full transition-all duration-1000 ease-out" 
          style={{ width: `${Math.min(progress, 100)}%` }}
        ></div>
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Deadline</span>
          <span className="text-sm font-medium text-gray-600">{new Date(campaign.deadline).toLocaleDateString()}</span>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
          {isActive ? 'Active' : 'Ended'}
        </div>
      </div>
      
      <div className="flex gap-3">
        {canWithdraw && (
          <button 
            onClick={() => onWithdraw(campaign._id || campaign.id)}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-2.5 rounded-xl shadow-md transform active:scale-95 transition-all"
          >
            Claim Funds
          </button>
        )}
        <button 
          onClick={() => onShowDonors(campaign._id || campaign.id)}
          className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold py-2.5 rounded-xl border border-gray-200 transform active:scale-95 transition-all"
        >
          View Donors
        </button>
      </div>
    </div>
  );
}