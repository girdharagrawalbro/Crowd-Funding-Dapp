import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Donation from "@/lib/models/Donation";
import { toDonationDTO } from "@/lib/dto";
import { createDonationRecord } from "@/app/api/donations/utils";

export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const campaignId = String(searchParams.get("campaignId") || "").trim();
    const donorId = String(searchParams.get("donorId") || "").trim();

    const query = {};
    if (campaignId) query.campaign = campaignId;
    if (donorId) query.donorId = donorId;

    const donations = await Donation.find(query)
      .populate("campaign", "title goal amountCollected deadline status")
      .sort({ donatedAt: -1 })
      .lean();

    return NextResponse.json(donations.map(toDonationDTO));
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to fetch donations" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const payload = await req.json();
    const result = await createDonationRecord(payload);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: result.status || 400 });
    }

    return NextResponse.json(result.donation, { status: result.status || 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to create donation" }, { status: 500 });
  }
}
