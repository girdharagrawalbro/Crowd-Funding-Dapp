require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-waffle");

require('dotenv').config({ path: "./.env.local" });

task("accounts", "Print the list of account", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
})

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {}, // Local network for testing
    // sepolia: {
    //   url: process.env.ALCHEMY_API_URL, // Replace with your Sepolia RPC
    //   accounts: [process.env.PRIVATE_KEY], // Use your wallet's private key
    // },
  },

};
