import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Donation from "@/lib/models/Donation";
import { normalizeWallet } from "@/lib/admin";

export async function GET(req, { params }) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const account = normalizeWallet(searchParams.get("account") || "");
    const campaignId = String(params.id || "").trim();

    if (!account) {
      return NextResponse.json({ hasDonated: false }, { status: 200 });
    }

    const existing = await Donation.findOne({
      campaignBlockchainId: campaignId,
      donorWallet: account,
    })
      .select("_id")
      .lean();

    return NextResponse.json({ hasDonated: Boolean(existing) });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to check donation" }, { status: 500 });
  }
}
