// app/api/users/[metaid]/route.js
import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma' // adjust path if needed

// export async function GET(req, { params }) {
//   const { metaid } = params;

//   try {
//     const user = await prisma.user.findUnique({
//       where: { metaid },
//     });

//     if (!user) {
//       return NextResponse.json({ error: 'User not found' }, { status: 404 });
//     }

//     return NextResponse.json(user);
//   } catch (error) {
//     console.error('Fetch error:', error);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }
export async function PATCH (req, { params }) {
  const { metaid } = params

  try {
    const body = await req.json()
    const { name } = body

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const updatedUser = await prisma.user.update({
      where: { metaid }, // Changed from metaid to walletAddress
      data: { name }
    })

    return NextResponse.json({ message: 'User updated', user: updatedUser })
  } catch (error) {
    console.error('Update error:', error)
    return NextResponse.json(
      { error: 'User not found or update failed' },
      { status: 404 }
    )``
  }
}
