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

    const userId = String(params.userId || "");

    const campaigns = await Campaign.find({ ownerId: userId }).sort({ createdAt: -1 }).lean();
    return NextResponse.json(campaigns.map(toCampaignDTO));
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to fetch user campaigns" }, { status: 500 });
  }
}
