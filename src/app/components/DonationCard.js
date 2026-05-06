"use client";

export default function DonationCard({ donation, onRefund }) {
  const progress = (donation.amountCollected / donation.goal) * 100;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 group">
      <h3 className="text-xl font-bold mb-4 theme-text truncate">{donation.title}</h3>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Your Contribution</span>
          <span className="text-lg font-black text-emerald-600">₹{donation.amount?.toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Campaign Goal</span>
          <span className="text-sm font-bold text-gray-700">₹{donation.goal?.toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Raised</span>
          <span className="text-sm font-bold text-teal-600">₹{donation.amountCollected?.toLocaleString()}</span>
        </div>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-2.5 mb-6 overflow-hidden">
        <div
          className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${Math.min(progress, 100)}%` }}
        ></div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col">
          <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Deadline</span>
          <span className="text-sm font-bold text-gray-600">
            {new Date(donation.deadline).toLocaleDateString()}
            {donation.isEnded && <span className="text-red-400 ml-1">(Ended)</span>}
          </span>
        </div>
        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${donation.isSuccessful ? 'bg-blue-100 text-blue-700' :
            donation.isEligibleForRefund ? 'bg-red-100 text-red-700' :
              'bg-emerald-100 text-emerald-700'
          }`}>
          {donation.isSuccessful ? 'Successful' :
            donation.isEligibleForRefund ? 'Refund Available' :
              'In Progress'}
        </div>
      </div>

      {donation.isEligibleForRefund && (
        <button
          onClick={() => onRefund(donation._id || donation.id)}
          className="w-full bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-black py-3 rounded-xl shadow-lg shadow-rose-100 transform active:scale-95 transition-all text-sm uppercase tracking-widest"
        >
          Request Refund
        </button>
      )}
    </div>
  );
}