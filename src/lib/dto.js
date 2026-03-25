export function toUserDTO(user) {
  if (!user) return null;
  return {
    id: user._id.toString(),
    _id: user._id.toString(),
    metaid: user.metaid,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export function toCampaignDTO(campaign) {
  if (!campaign) return null;
  const mongoId = campaign._id.toString();
  const blockchainId = campaign.blockchainId || null;

  return {
    id: blockchainId || mongoId,
    mongoId,
    blockchainId,
    ownerWallet: campaign.ownerWallet,
    title: campaign.title,
    description: campaign.description,
    desc: campaign.description,
    goal: campaign.goal,
    deadline: campaign.deadline,
    endDate: campaign.deadline,
    amountCollected: campaign.amountCollected,
    currentDonation: campaign.amountCollected,
    donationCount: campaign.donationCount,
    isWithdrawn: campaign.isWithdrawn,
    status: campaign.status,
    approval: campaign.approval,
    createTxHash: campaign.createTxHash,
    network: campaign.network,
    createdAt: campaign.createdAt,
    updatedAt: campaign.updatedAt,
  };
}

export function toDonationDTO(donation) {
  if (!donation) return null;
  return {
    id: donation._id.toString(),
    campaignId: donation.campaign.toString(),
    campaignBlockchainId: donation.campaignBlockchainId,
    donorWallet: donation.donorWallet,
    amountEth: donation.amountEth,
    txHash: donation.txHash,
    network: donation.network,
    status: donation.status,
    donatedAt: donation.donatedAt,
    createdAt: donation.createdAt,
  };
}
