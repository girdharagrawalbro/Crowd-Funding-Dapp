import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { toUserDTO } from "@/lib/dto";

export async function GET(_req, { params }) {
  try {
    await connectToDatabase();

    const userId = params.userId;
    const user = await User.findOne({ userId });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: toUserDTO(user) });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to fetch user" }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const body = await req.json();
    const name = body?.name?.trim();

    if (!name) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    await connectToDatabase();

    const userId = params.userId;
    const user = await User.findOneAndUpdate(
      { userId },
      { $set: { name } },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: toUserDTO(user) });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to update user" }, { status: 500 });
  }
}
