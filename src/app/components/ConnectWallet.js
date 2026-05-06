"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { setAccount, disconnectAccount } from "../store/slices/accountSlice";
import { createUser } from '../store/slices/userSlice';
import Link from "next/link";

const ConnectWallet = ({ mobile = false }) => {
  const dispatch = useDispatch();
  const { userId, name, balance } = useSelector((state) => state.account);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [inputName, setInputName] = useState("");

  const logout = () => {
    dispatch(disconnectAccount());
    toast.success("Logged out successfully!");
    setIsMenuOpen(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!inputName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    const generatedUserId = inputName.toLowerCase().replace(/\s+/g, '_') + '_' + Math.floor(Math.random() * 1000);

    try {
      const userData = { userId: generatedUserId, name: inputName };
      await dispatch(createUser(userData)).unwrap();

      dispatch(setAccount({
        userId: generatedUserId,
        name: inputName,
        balance: "5000" // Starting balance for demo
      }));

      toast.success(`Welcome, ${inputName}!`);
      setIsLoginModalOpen(false);
      setInputName("");
    } catch (error) {
      toast.error(error || "Login failed");
    }
  };

  return (
    <div className="relative">
      {userId ? (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 rounded-full text-white font-medium shadow-md ${mobile ? 'py-2 px-4 text-sm' : 'py-2.5 px-6'}`}
          >
            Hi, {name}
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
              <div className="px-4 py-2 text-sm text-gray-700 border-b">
                Balance: ₹{balance}
              </div>
              <Link href="/creator-dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
                My Campaigns
              </Link>
              <Link href="/donor-dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
                My Donations
              </Link>
              <Link href="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
                Admin Review
              </Link>
              <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className={`bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 rounded-full text-white font-medium shadow-md ${mobile ? 'py-2 px-4 text-sm' : 'py-2.5 px-6'}`}
          >
            Login
          </button>

          {isLoginModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
              <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md animate-in fade-in zoom-in duration-300">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold theme-text">Welcome Back</h2>
                  <button onClick={() => setIsLoginModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      value={inputName}
                      onChange={(e) => setInputName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                      autoFocus
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3 rounded-xl shadow-lg transform active:scale-95 transition-all"
                  >
                    Start Helping
                  </button>
                </form>
                <p className="mt-4 text-center text-xs text-gray-500">
                  Join our community of donors and creators today.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ConnectWallet;
