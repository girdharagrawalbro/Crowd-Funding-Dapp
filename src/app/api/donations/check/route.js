
export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const campaignId = searchParams.get("campaignId");
  const donorId = searchParams.get("donorId");

  try {
    const existing = await Donation.findOne({ campaign: campaignId, donor: donorId });

    return Response.json({ hasDonated: !!existing });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
