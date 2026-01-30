'use client'

import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function CreatorDashboardRedirect() {
  useEffect(() => {
    redirect('/creator-dashboard')
  }, [])

  return null
}
 