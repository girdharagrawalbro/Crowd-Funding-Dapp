import React from 'react';
import { useState } from 'react'
import Link from "next/link";
import ConnectWallet from "./ConnectWallet";

const Header = ({ setAccount }) => {

  return (
    <header>
      <div className="container mx-auto flex items-center justify-between px-4 py-2">
        {/* Left Section: Header Text */}
        <div className="logo-section flex flex-col text-center justify-center items-center">
          <img src="logo.png" alt="logo" className="logo" width="55px" />
          <h6>
            CROWD FUNDING
          </h6>
        </div>

        {/* Middle Section: Navigation Links */}
        <nav className="flex gap-24 theme-bg border border-green-300 theme-text font-medium padding items-center pl-28 rounded-full">
          <Link href="/" className="hover:border-b-2">Home</Link>
          <Link href="/about" className="hover:border-b-2">About</Link>
          <Link href="/create" className="hover:border-b-2">
            Create Campaign
          </Link>
          <ConnectWallet setAccount={setAccount} />
        </nav>

      </div>
    </header>
  );
};

export default Header;