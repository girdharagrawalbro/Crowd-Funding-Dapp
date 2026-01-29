// const hre = require("hardhat");

// async function main() {
//     const Crowdfunding = await hre.ethers.getContractFactory("Crowdfunding");
//     const crowdfunding = await Crowdfunding.deploy(); // Deploy contract

//     await crowdfunding.waitForDeployment(); // Ensure deployment is complete

//     console.log(`✅ Crowdfunding Contract deployed to: ${await crowdfunding.getAddress()}`);
// }

// main()
//     .then(() => process.exit(0))
//     .catch((error) => {
//         console.error(error);
//         process.exit(1);
//     });

const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying Crowdfunding contract...");
  console.log(`📡 Network: ${hre.network.name}`);
  
  const Crowdfunding = await hre.ethers.getContractFactory("Crowdfunding");
  const crowdfunding = await Crowdfunding.deploy();
  
  // Wait for deployment (works with newer ethers versions)
  await crowdfunding.waitForDeployment();
  
  const address = await crowdfunding.getAddress();
  
  console.log("\n✅ Crowdfunding deployed to:", address);
  console.log("\n📋 Next steps:");
  console.log(`   1. Update LOCAL_CONTRACT_ADDRESS in src/app/lib/constants.js to: "${address}"`);
  console.log("   2. Make sure NEXT_PUBLIC_NETWORK_MODE=local in .env.local");
  console.log("   3. Add Hardhat network to MetaMask (Chain ID: 31337, RPC: http://127.0.0.1:8545)");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
