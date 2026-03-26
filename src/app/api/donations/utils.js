import Campaign from "@/lib/models/Campaign";
import Donation from "@/lib/models/Donation";
import { toDonationDTO } from "@/lib/dto";

export async function createDonationRecord(input) {
  const campaignId = String(input.campaignId || "").trim();
  const donorId = String(input.donorId || "").trim();
  const donorName = String(input.donorName || "Anonymous").trim();
  const amount = Number(input.amount ?? input.donationAmount);

  if (!campaignId || !donorId || Number.isNaN(amount) || amount <= 0) {
    return { error: "campaignId, donorId and positive amount are required", status: 400 };
  }

  const campaign = await Campaign.findById(campaignId);

  if (!campaign) {
    return { error: "Campaign not found", status: 404 };
  }

  const donation = await Donation.create({
    campaign: campaign._id,
    donorId,
    donorName,
    amount,
    donatedAt: new Date(),
  });

  campaign.amountCollected += amount;
  campaign.donationCount += 1;
  await campaign.save();

  return {
    donation: toDonationDTO(donation),
    campaign,
    status: 201,
  };
}
