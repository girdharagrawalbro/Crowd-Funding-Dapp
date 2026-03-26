import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Campaign from "@/lib/models/Campaign";
import User from "@/lib/models/User";
import { toCampaignDTO } from "@/lib/dto";

export async function GET(req) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const ownerId = (searchParams.get("ownerId") || "").trim();
    const status = searchParams.get("status");
    const includeAllStatuses = searchParams.get("allStatuses") === "true";

    const query = {};

    if (ownerId) {
      query.ownerId = ownerId;
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

    const ownerId = (body?.ownerId || "").trim();

    if (!ownerId) {
      return NextResponse.json({ error: "ownerId is required" }, { status: 400 });
    }

    await connectToDatabase();

    const ownerUser = await User.findOne({ userId: ownerId }).select("_id");

    const payload = {
      title: body.title,
      description: body.description,
      goal: Number(body.goal),
      deadline: new Date(body.deadline),
      amountCollected: Number(body.amountCollected || 0),
      isWithdrawn: Boolean(body.isWithdrawn || false),
      ownerId,
      ownerName: body.ownerName || "Anonymous",
      ownerUser: ownerUser?._id || null,
      status: "pending",
    };

    const campaign = await Campaign.create(payload);
    return NextResponse.json(toCampaignDTO(campaign), { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to create campaign" }, { status: 500 });
  }
}
