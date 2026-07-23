'use client'

import React from 'react'
import { CheckInScanner } from '@/visitors/CheckInScanner'
import './VisitorCheckIn.scss'

export function VisitorCheckInView() {
  return (
    <div className="visitor-admin-checkin">
      <div className="visitor-admin-checkin__inner">
        <h1>Visitor check-in</h1>
        <p>
          Scan a visitor QR code or paste the ticket token. You are authenticated as an admin
          user for the active microsite.
        </p>
        <CheckInScanner credentials="include" />
      </div>
    </div>
  )
}

export default VisitorCheckInView
