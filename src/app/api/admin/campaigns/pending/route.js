import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Campaign from "@/lib/models/Campaign";
import { toCampaignDTO } from "@/lib/dto";
import { isAdminUser } from "@/lib/admin";

export async function GET(req) {
  try {
    await connectToDatabase();

    const adminId = req.headers.get("x-admin-id") || "";
    const allowed = isAdminUser(adminId);

    if (!allowed) {
      return NextResponse.json({ error: "Unauthorized admin" }, { status: 403 });
    }

    const campaigns = await Campaign.find({ status: "pending" }).sort({ createdAt: 1 }).lean();
    return NextResponse.json(campaigns.map(toCampaignDTO));
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to fetch pending campaigns" }, { status: 500 });
  }
}
