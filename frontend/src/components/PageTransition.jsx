import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const PageTransition = ({ children }) => {
  const location = useLocation()
  const [displayLocation, setDisplayLocation] = useState(location)
  const [transitionStage, setTransitionStage] = useState('fadeIn')

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setTransitionStage('fadeOut')
    }
  }, [location, displayLocation])

  useEffect(() => {
    if (transitionStage === 'fadeOut') {
      const timer = setTimeout(() => {
        setDisplayLocation(location)
        setTransitionStage('fadeIn')
      }, 200) // Half of animation duration (400ms / 2)
      return () => clearTimeout(timer)
    }
  }, [transitionStage, location])

  return (
    <div
      key={displayLocation.pathname}
      className={`page-transition page-transition-${transitionStage}`}
    >
      {children}
    </div>
  )
}

export default PageTransition

