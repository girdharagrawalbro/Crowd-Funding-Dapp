import prisma from "@/lib/prisma";

export async function POST(req) {
  const { eventId, userId, amount } = await req.json();

  try {
    // Create the donation
    const donation = await prisma.donation.create({
      data: {
        eventId: parseInt(eventId),
        userId: parseInt(userId),
        donationAmount: parseFloat(amount),
      },
    });

    // Update the event's current donation amount
    await prisma.event.update({
      where: { id: parseInt(eventId) },
      data: {
        currentDonation: {
          increment: parseFloat(amount),
        },
      },
    });

    return Response.json({ success: true, donation });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
