import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { toUserDTO } from "@/lib/dto";
import { normalizeWallet, isConfiguredAdminWallet } from "@/lib/admin";

export async function POST(req) {
  try {
    const body = await req.json();
    const metaid = normalizeWallet(body?.metaid);

    if (!metaid) {
      return NextResponse.json({ error: "metaid (wallet) is required" }, { status: 400 });
    }

    await connectToDatabase();

    const role = body?.role === "admin" || isConfiguredAdminWallet(metaid) ? "admin" : "user";

    const user = await User.findOneAndUpdate(
      { metaid },
      {
        $set: {
          metaid,
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
