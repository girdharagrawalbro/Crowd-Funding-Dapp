import { connectDB } from "@/lib/mongodb";
import Donation from "@/models/Donation";
import Campaign from "@/models/Campaign";

export async function POST(req) {
  await connectDB();
  const { campaignId, donorId, amount } = await req.json();

  try {
    const donation = await Donation.create({ campaign: campaignId, donor: donorId, amount });

    await Campaign.findByIdAndUpdate(campaignId, {
      $inc: { currentAmount: amount },
      $push: { donations: donation._id }
    });

    return Response.json({ success: true, donation });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
