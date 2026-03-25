import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Donation from "@/lib/models/Donation";
import { toDonationDTO } from "@/lib/dto";

export async function GET(_req, { params }) {
  try {
    await connectToDatabase();

    const eventId = String(params.eventId || "").trim();
    const donations = await Donation.find({ campaignBlockchainId: eventId }).sort({ donatedAt: -1 }).lean();

    return NextResponse.json(donations.map(toDonationDTO));
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to fetch event donations" }, { status: 500 });
  }
}
