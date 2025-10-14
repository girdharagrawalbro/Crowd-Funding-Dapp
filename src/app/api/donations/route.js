import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// Get donations for a specific event
export async function GET(request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const eventId = parseInt(searchParams.get('eventId'))

    // Verify the requesting user has access to this event's donations
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { userId: true }
    })

    if (!event || event.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const donations = await prisma.donation.findMany({
      where: { eventId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        donatedAt: 'desc'
      }
    })

    return NextResponse.json(donations)
  } catch (error) {
    console.error('Error fetching donations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch donations' },
      { status: 500 }
    )
  }
}

// POST /api/donations - Create new donation
export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, eventId, donationAmount } = body;

    // Create the donation
    const donation = await prisma.donation.create({
      data: {
        userId,
        eventId,
        donationAmount,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        event: true,
      },
    });

    // Update the event's current donation amount
    await prisma.event.update({
      where: { id: eventId },
      data: {
        currentDonation: {
          increment: donationAmount,
        },
      },
    });

    return NextResponse.json(donation);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create donation' },
      { status: 500 }
    );
  }
}

const { events, currentEvent, donations, status, error } = useSelector(state => state.events)