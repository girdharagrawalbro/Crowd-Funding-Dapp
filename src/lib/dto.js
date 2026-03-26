export function toUserDTO(user) {
  if (!user) return null;
  return {
    id: user._id.toString(),
    _id: user._id.toString(),
    userId: user.userId,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export function toCampaignDTO(campaign) {
  if (!campaign) return null;
  const mongoId = campaign._id.toString();

  return {
    id: mongoId,
    mongoId,
    ownerId: campaign.ownerId,
    ownerName: campaign.ownerName || "Anonymous",
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
    createdAt: campaign.createdAt,
    updatedAt: campaign.updatedAt,
  };
}

export function toDonationDTO(donation) {
  if (!donation) return null;
  return {
    id: donation._id.toString(),
    campaignId: donation.campaign.toString(),
    donorId: donation.donorId,
    donorName: donation.donorName || "Anonymous",
    amount: donation.amount,
    donatedAt: donation.donatedAt,
    createdAt: donation.createdAt,
  };
}
