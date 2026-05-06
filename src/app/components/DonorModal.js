"use client";

export default function DonorModal({ isOpen, onClose, donors, campaign }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col border border-gray-100 transform animate-in slide-in-from-bottom-8 duration-500">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-emerald-50 to-teal-50">
          <div>
            <h3 className="text-2xl font-black theme-text">
              Campaign Supporters
            </h3>
            <p className="text-gray-500 font-medium text-sm">For "{campaign?.title}"</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:shadow-md text-gray-400 hover:text-gray-600 transition-all text-2xl"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
              <p className="text-xs text-emerald-600 font-bold uppercase tracking-widest mb-1">Total Donors</p>
              <p className="text-2xl font-black text-emerald-700">{donors.length}</p>
            </div>
            <div className="flex-1 bg-teal-50 rounded-2xl p-4 border border-teal-100">
              <p className="text-xs text-teal-600 font-bold uppercase tracking-widest mb-1">Total Raised</p>
              <p className="text-2xl font-black text-teal-700">₹{campaign?.amountCollected?.toLocaleString() || 0}</p>
            </div>
          </div>

          <div className="space-y-3">
            {donors.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 font-medium">No donations yet. Be the first to support!</p>
              </div>
            ) : (
              donors.map((donor, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center font-bold text-emerald-700 group-hover:from-emerald-200 group-hover:to-teal-200 transition-colors">
                      {donor.donorName?.charAt(0) || 'D'}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{donor.donorName || "Anonymous Supporter"}</p>
                      <p className="text-xs text-gray-400">{new Date(donor.donatedAt || Date.now()).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black theme-text">
                      ₹{donor.amount?.toLocaleString() || 0}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
          <button
            onClick={onClose}
            className="text-sm font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
