"use client";
import { useState } from "react";
import Link from "next/link";
import ConnectWallet from "./ConnectWallet";
import Image from 'next/image';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo Section */}
        <div className="logo-section flex items-center gap-2">
          <Image 
              src="/logo.png" 
              alt="logo" 
              className="logo" 
              width={45}
              height={45}
              priority
          />
          <h6 className="text-sm hidden sm:block text-black">CROWD FUNDING</h6>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-8 bg-[#DBEAFE] border border-blue-300 text-[#1E40AF] font-medium py-1 px-6 lg:px-8 rounded-full">
          <Link href="/" className="hover:text-blue-700 px-2">Home</Link>
          <Link href="/about" className="hover:text-blue-700 px-2">About</Link>
          <Link href="/create" className="hover:text-blue-700 px-2">Create Campaign</Link>
          <ConnectWallet />
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2">
          <ConnectWallet mobile />
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-gray-700 rounded-md focus:outline-none"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#DBEAFE] border-t border-blue-300">
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-4">
            <Link 
              href="/" 
              className="text-[#1E40AF] font-medium py-2 hover:bg-blue-100 rounded px-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className="text-[#1E40AF] font-medium py-2 hover:bg-blue-100 rounded px-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/create" 
              className="text-[#1E40AF] font-medium py-2 hover:bg-blue-100 rounded px-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Create Campaign
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;