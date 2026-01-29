// Mock data for screenshots and demo purposes
// Set NEXT_PUBLIC_USE_MOCK_DATA=true in .env.local to enable

export const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

// Mock campaigns data
export const mockCampaigns = [
  {
    id: 0,
    owner: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    title: "Help Build a School in Rural India",
    description: "We are raising funds to build a primary school in a remote village in Rajasthan. This school will provide education to over 200 children who currently have no access to proper schooling. Your contribution will help us construct classrooms, purchase educational materials, and hire qualified teachers.",
    goal: "5",
    deadline: Math.floor(Date.now() / 1000) + 86400 * 30, // 30 days from now
    amountCollected: "3.25",
  },
  {
    id: 1,
    owner: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    title: "Medical Treatment for Cancer Patient",
    description: "Helping a 45-year-old father of three get the cancer treatment he desperately needs. The family cannot afford the medical expenses and your donation can save his life.",
    goal: "10",
    deadline: Math.floor(Date.now() / 1000) + 86400 * 15, // 15 days from now
    amountCollected: "7.8",
  },
  {
    id: 2,
    owner: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    title: "Clean Water Project for Village",
    description: "Installing water purification systems in 5 villages that currently lack access to clean drinking water. This project will benefit over 2,000 families.",
    goal: "8",
    deadline: Math.floor(Date.now() / 1000) + 86400 * 45, // 45 days from now
    amountCollected: "2.5",
  },
  {
    id: 3,
    owner: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    title: "Support Orphanage Renovation",
    description: "The local orphanage needs urgent repairs including roof fixing, painting, and new beds for 50 children. Help us give these children a safe and comfortable home.",
    goal: "3",
    deadline: Math.floor(Date.now() / 1000) + 86400 * 20, // 20 days from now
    amountCollected: "2.9",
  },
  {
    id: 4,
    owner: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    title: "Disaster Relief Fund",
    description: "Emergency relief fund for families affected by recent floods. Funds will be used for food, shelter, and medical supplies.",
    goal: "15",
    deadline: Math.floor(Date.now() / 1000) + 86400 * 10, // 10 days from now
    amountCollected: "11.2",
  },
];

// Mock donors data
export const mockDonors = {
  0: [
    { account: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", amount: "1.5", timestamp: Date.now() - 86400000 * 2 },
    { account: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", amount: "0.75", timestamp: Date.now() - 86400000 },
    { account: "0x90F79bf6EB2c4f870365E785982E1f101E93b906", amount: "1.0", timestamp: Date.now() - 3600000 },
  ],
  1: [
    { account: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", amount: "2.5", timestamp: Date.now() - 86400000 * 5 },
    { account: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", amount: "3.0", timestamp: Date.now() - 86400000 * 3 },
    { account: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65", amount: "2.3", timestamp: Date.now() - 86400000 },
  ],
  2: [
    { account: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", amount: "1.0", timestamp: Date.now() - 86400000 * 4 },
    { account: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", amount: "1.5", timestamp: Date.now() - 86400000 * 2 },
  ],
  3: [
    { account: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", amount: "0.5", timestamp: Date.now() - 86400000 * 3 },
    { account: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", amount: "1.2", timestamp: Date.now() - 86400000 * 2 },
    { account: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65", amount: "1.2", timestamp: Date.now() - 86400000 },
  ],
  4: [
    { account: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", amount: "3.0", timestamp: Date.now() - 86400000 * 2 },
    { account: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", amount: "2.5", timestamp: Date.now() - 86400000 },
    { account: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", amount: "3.2", timestamp: Date.now() - 3600000 * 6 },
    { account: "0x90F79bf6EB2c4f870365E785982E1f101E93b906", amount: "2.5", timestamp: Date.now() - 3600000 },
  ],
};

// Mock account (simulates connected wallet)
export const mockAccount = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

// Helper functions to work with mock data
export const getMockCampaign = (id) => {
  return mockCampaigns.find(c => c.id === parseInt(id)) || null;
};

export const getMockDonors = (campaignId) => {
  return mockDonors[campaignId] || [];
};

// Simulate donation (for demo - updates mock data temporarily)
let tempDonations = {};
let tempCampaigns = [...mockCampaigns]; // Mutable copy of campaigns

export const simulateDonation = (campaignId, amount) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate transaction delay
      if (!tempDonations[campaignId]) {
        tempDonations[campaignId] = 0;
      }
      tempDonations[campaignId] += parseFloat(amount);
      resolve({ success: true, txHash: "0x" + Math.random().toString(16).slice(2, 66) });
    }, 2000); // 2 second delay to simulate blockchain transaction
  });
};

export const getTempDonationAmount = (campaignId) => {
  return tempDonations[campaignId] || 0;
};

// Create a new mock campaign
export const createMockCampaign = (campaignData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newId = tempCampaigns.length;
      const newCampaign = {
        id: newId,
        owner: campaignData.owner || mockAccount,
        title: campaignData.title,
        description: campaignData.description,
        goal: campaignData.goal.toString(),
        deadline: Math.floor(new Date(campaignData.deadline).getTime() / 1000),
        amountCollected: "0",
      };
      
      tempCampaigns.push(newCampaign);
      mockDonors[newId] = []; // Initialize empty donors array for new campaign
      
      resolve({ 
        success: true, 
        campaign: newCampaign,
        txHash: "0x" + Math.random().toString(16).slice(2, 66) 
      });
    }, 2000); // 2 second delay to simulate blockchain transaction
  });
};

// Get all campaigns (including newly created ones)
export const getAllMockCampaigns = () => {
  return tempCampaigns;
};

// Get campaigns by owner
export const getMockCampaignsByOwner = (ownerAddress) => {
  return tempCampaigns.filter(c => 
    c.owner.toLowerCase() === ownerAddress.toLowerCase()
  );
};

// Reset mock data (useful for testing)
export const resetMockData = () => {
  tempCampaigns = [...mockCampaigns];
  tempDonations = {};
};
