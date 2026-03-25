import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Campaign from "@/lib/models/Campaign";
import { toCampaignDTO } from "@/lib/dto";
import { isAdminWallet } from "@/lib/admin";

export async function GET(req) {
  try {
    await connectToDatabase();

    const adminWallet = req.headers.get("x-admin-wallet") || "";
    const allowed = await isAdminWallet(adminWallet);

    if (!allowed) {
      return NextResponse.json({ error: "Unauthorized admin wallet" }, { status: 403 });
    }

    const campaigns = await Campaign.find({ status: "pending" }).sort({ createdAt: 1 }).lean();
    return NextResponse.json(campaigns.map(toCampaignDTO));
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to fetch pending campaigns" }, { status: 500 });
  }
}
