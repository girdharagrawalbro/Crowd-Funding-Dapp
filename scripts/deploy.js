const hre = require("hardhat");

async function main() {
    const Crowdfunding = await hre.ethers.getContractFactory("Crowdfunding");
    const crowdfunding = await Crowdfunding.deploy(); // Deploy contract

    await crowdfunding.waitForDeployment(); // Ensure deployment is complete

    console.log(`✅ Crowdfunding Contract deployed to: ${await crowdfunding.getAddress()}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
