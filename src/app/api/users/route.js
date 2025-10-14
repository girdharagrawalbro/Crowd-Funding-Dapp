import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma'; // adjust to your path

export async function POST(req) {
  try {
    const body = await req.json();
    const { metaid, name } = body;

    if (!metaid || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user with the given metaid already exists
    const existingUser = await prisma.user.findUnique({
      where: { metaid },
    });

    if (existingUser) {
      return NextResponse.json(existingUser, { status: 200 });

    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        metaid,
        name,
      },
    });

    return NextResponse.json(newUser, { status: 201 });

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// export async function GET() {
//   const users = await prisma.user.findMany();
//   return NextResponse.json(users);
// }
