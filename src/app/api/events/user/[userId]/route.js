import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import Campaign from "@/lib/models/Campaign";
import User from "@/lib/models/User";
import { toCampaignDTO } from "@/lib/dto";
import { normalizeWallet } from "@/lib/admin";

export async function GET(_req, { params }) {
  try {
    await connectToDatabase();

    const input = String(params.userId || "");
    let user = null;

    if (mongoose.Types.ObjectId.isValid(input)) {
      user = await User.findById(input);
    }

    if (!user) {
      const wallet = normalizeWallet(input);
      if (wallet) {
        user = await User.findOne({ metaid: wallet });
      }
    }

    if (!user) {
      return NextResponse.json([], { status: 200 });
    }

    const campaigns = await Campaign.find({ ownerWallet: user.metaid }).sort({ createdAt: -1 }).lean();
    return NextResponse.json(campaigns.map(toCampaignDTO));
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to fetch user campaigns" }, { status: 500 });
  }
}
