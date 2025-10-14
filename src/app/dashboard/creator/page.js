'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEventsByUser } from '@/app/store/slices/eventSlice'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function CreatorDashboard() {
  const dispatch = useDispatch()
  const { data: session } = useSession()
  const { events, status, error } = useSelector((state) => state.events)

  useEffect(() => {
    if (session?.user?.id) {
      dispatch(fetchEventsByUser(session.user.id))
    }
  }, [dispatch, session?.user?.id])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (status === 'failed') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Events</h1>
        <Link
          href="/dashboard/creator/create"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Create New Event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">You haven't created any events yet.</p>
          <Link
            href="/dashboard/creator/create"
            className="text-blue-500 hover:text-blue-600 mt-4 inline-block"
          >
            Create your first event
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-2">{event.desc}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Goal:</span>
                    <span className="font-medium">${event.goal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Raised:</span>
                    <span className="font-medium">${event.currentDonation}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Status:</span>
                    <span className={`font-medium ${
                      event.status === 'active' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${Math.min(
                          (event.currentDonation / event.goal) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="mt-6 flex justify-between">
                  <Link
                    href={`/dashboard/creator/events/${event.id}`}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    View Details
                  </Link>
                  <Link
                    href={`/dashboard/creator/events/${event.id}/edit`}
                    className="text-gray-500 hover:text-gray-600"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 