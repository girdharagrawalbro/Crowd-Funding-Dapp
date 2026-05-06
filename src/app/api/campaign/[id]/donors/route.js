import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Donation from "@/lib/models/Donation";

export async function GET(_req, { params }) {
  try {
    await connectToDatabase();

    const campaignId = String(params.id || "").trim();

    const donations = await Donation.find({ campaignBlockchainId: campaignId })
      .sort({ donatedAt: -1 })
      .lean();

    const donors = donations.map((donation) => ({
      donorId: donation.donorId,
      donorName: donation.donorName,
      amount: donation.amount,
      donatedAt: donation.donatedAt,
    }));

    return NextResponse.json({ donors });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to fetch donors" }, { status: 500 });
  }
}
