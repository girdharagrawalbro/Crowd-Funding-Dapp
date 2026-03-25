import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { createDonationRecord } from "@/app/api/donations/utils";

export async function POST(req) {
  try {
    await connectToDatabase();
    const payload = await req.json();
    const result = await createDonationRecord(payload);

    if (result.error) {
      return NextResponse.json({ success: false, error: result.error }, { status: result.status || 400 });
    }

    return NextResponse.json({ success: true, donation: result.donation }, { status: result.status || 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
