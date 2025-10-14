import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/donations/event/[eventId] - Get donations by event ID
export async function GET(request, { params }) {
  try {
    const eventId = parseInt(params.eventId);
    
    const donations = await prisma.donation.findMany({
      where: {
        eventId: eventId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        donatedAt: 'desc',
      },
    });

    return NextResponse.json(donations);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch event donations' },
      { status: 500 }
    );
  }
} 