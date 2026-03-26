import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { toUserDTO } from "@/lib/dto";
import { isAdminUser } from "@/lib/admin";

export async function POST(req) {
  try {
    const body = await req.json();
    const userId = (body?.userId || "").trim();

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    await connectToDatabase();

    const role = isAdminUser(userId) ? "admin" : "user";

    const user = await User.findOneAndUpdate(
      { userId },
      {
        $set: {
          userId,
          name: body?.name?.trim() || "User",
          role,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json(toUserDTO(user));
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to create user" }, { status: 500 });
  }
}
