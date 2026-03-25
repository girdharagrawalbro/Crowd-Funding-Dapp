import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Campaign from "@/lib/models/Campaign";
import User from "@/lib/models/User";
import { toCampaignDTO } from "@/lib/dto";
import { normalizeWallet } from "@/lib/admin";

export async function GET(req) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const ownerWallet = normalizeWallet(searchParams.get("ownerWallet") || "");
    const status = searchParams.get("status");
    const includeAllStatuses = searchParams.get("allStatuses") === "true";

    const query = {};

    if (ownerWallet) {
      query.ownerWallet = ownerWallet;
      if (!includeAllStatuses && !status) {
        query.status = "approved";
      }
    } else if (status) {
      query.status = status;
    } else {
      query.status = "approved";
    }

    const campaigns = await Campaign.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json(campaigns.map(toCampaignDTO));
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to fetch campaigns" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body?.title || !body?.description || !body?.goal || !body?.deadline) {
      return NextResponse.json({ error: "title, description, goal and deadline are required" }, { status: 400 });
    }

    const ownerWallet = normalizeWallet(body?.ownerWallet || body?.metaid || "");

    if (!ownerWallet) {
      return NextResponse.json({ error: "ownerWallet is required" }, { status: 400 });
    }

    await connectToDatabase();

    const ownerUser = await User.findOne({ metaid: ownerWallet }).select("_id");

    const payload = {
      title: body.title,
      description: body.description,
      goal: Number(body.goal),
      deadline: new Date(body.deadline),
      amountCollected: Number(body.amountCollected || 0),
      isWithdrawn: Boolean(body.isWithdrawn || false),
      ownerWallet,
      ownerUser: ownerUser?._id || null,
      blockchainId: body.blockchainId ? String(body.blockchainId) : undefined,
      createTxHash: body.createTxHash || null,
      network: body.network || process.env.NEXT_PUBLIC_NETWORK_MODE || "local",
      status: "pending",
    };

    const campaign = await Campaign.create(payload);
    return NextResponse.json(toCampaignDTO(campaign), { status: 201 });
  } catch (error) {
    if (String(error?.message || "").includes("duplicate key")) {
      return NextResponse.json({ error: "Campaign already exists for this blockchainId" }, { status: 409 });
    }

    return NextResponse.json({ error: error.message || "Failed to create campaign" }, { status: 500 });
  }
}
