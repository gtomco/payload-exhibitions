'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

const PageClient: React.FC<{ heroDarkOverlay?: boolean }> = ({ heroDarkOverlay }) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    if (heroDarkOverlay) {
      setHeaderTheme('light')
    }
  }, [heroDarkOverlay, setHeaderTheme])
  return <React.Fragment />
}

export default PageClient
