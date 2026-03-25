import Campaign from "@/lib/models/Campaign";
import Donation from "@/lib/models/Donation";
import { toDonationDTO } from "@/lib/dto";
import { normalizeWallet } from "@/lib/admin";

export async function createDonationRecord(input) {
  const campaignKey = String(input.campaignId || input.eventId || "").trim();
  const donorWallet = normalizeWallet(input.donorWallet || input.account || input.donorId || input.userId || "");
  const amountEth = Number(input.amount ?? input.donationAmount);

  if (!campaignKey || !donorWallet || Number.isNaN(amountEth) || amountEth <= 0) {
    return { error: "campaignId, donorWallet and positive amount are required", status: 400 };
  }

  const campaign = await Campaign.findOne({
    $or: [{ blockchainId: campaignKey }, { _id: campaignKey }],
  });

  if (!campaign) {
    return { error: "Campaign not found", status: 404 };
  }

  const txHash = input.txHash ? String(input.txHash) : null;

  if (txHash) {
    const duplicate = await Donation.findOne({ txHash });
    if (duplicate) {
      return {
        donation: toDonationDTO(duplicate),
        status: 200,
        campaign,
      };
    }
  }

  const donation = await Donation.create({
    campaign: campaign._id,
    campaignBlockchainId: campaign.blockchainId || campaign._id.toString(),
    donorWallet,
    amountEth,
    txHash,
    network: input.network || campaign.network,
    status: input.status || "confirmed",
  });

  campaign.amountCollected += amountEth;
  campaign.donationCount += 1;
  await campaign.save();

  return {
    donation: toDonationDTO(donation),
    campaign,
    status: 201,
  };
}
