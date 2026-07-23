'use client'

import { useEffect, useState } from 'react'

import type { PublicLang } from '@/microsite/constants'
import { langChoice } from '@/microsite/copy'

export function Countdown({
  lang,
  startIso = '2026-10-29T08:00:00.000Z',
}: {
  lang: PublicLang
  startIso?: string
}) {
  const [parts, setParts] = useState({ days: '--', hours: '--', minutes: '--', seconds: '--' })

  useEffect(() => {
    const tick = () => {
      const diff = new Date(startIso).getTime() - Date.now()
      if (diff <= 0) {
        setParts({ days: '0', hours: '0', minutes: '0', seconds: '0' })
        return
      }
      const days = Math.floor(diff / 86400000)
      const hours = Math.floor((diff % 86400000) / 3600000)
      const minutes = Math.floor((diff % 3600000) / 60000)
      const seconds = Math.floor((diff % 60000) / 1000)
      setParts({
        days: String(days),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
      })
    }
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [startIso])

  return (
    <div className="event-countdown">
      <span>{langChoice(lang, 'ECGE fillon per', 'Fair starts in')}</span>
      <div className="countdown-units">
        <b>
          <strong>{parts.days}</strong>
          <em>{langChoice(lang, 'Dite', 'Days')}</em>
        </b>
        <b>
          <strong>{parts.hours}</strong>
          <em>{langChoice(lang, 'Ore', 'Hours')}</em>
        </b>
        <b>
          <strong>{parts.minutes}</strong>
          <em>{langChoice(lang, 'Min', 'Minutes')}</em>
        </b>
        <b>
          <strong>{parts.seconds}</strong>
          <em>{langChoice(lang, 'Sek', 'Seconds')}</em>
        </b>
      </div>
    </div>
  )
}
