import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Campaign from "@/lib/models/Campaign";
import { toCampaignDTO } from "@/lib/dto";
import { isAdminWallet, normalizeWallet } from "@/lib/admin";

export async function POST(req, { params }) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const adminWallet = normalizeWallet(req.headers.get("x-admin-wallet") || body?.adminWallet || "");

    const allowed = await isAdminWallet(adminWallet);
    if (!allowed) {
      return NextResponse.json({ error: "Unauthorized admin wallet" }, { status: 403 });
    }

    const note = body?.note?.trim() || "Rejected by admin";

    const campaign = await Campaign.findByIdAndUpdate(
      params.id,
      {
        $set: {
          status: "rejected",
          approval: {
            reviewedBy: adminWallet,
            note,
            reviewedAt: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    return NextResponse.json({ campaign: toCampaignDTO(campaign) });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to reject campaign" }, { status: 500 });
  }
}
