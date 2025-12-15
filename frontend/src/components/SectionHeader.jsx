import React from 'react'
import { Link } from 'react-router-dom'

const SectionHeader = ({ title, subtitle, viewAllLink, viewAllText = "Xem tất cả" }) => {
  return (
    <div className="flex items-center justify-between mb-8 sm:mb-12 lg:mb-16">
      <div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-light uppercase tracking-wider text-[#111111]">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-sm font-light text-[#222222]">
            {subtitle}
          </p>
        )}
      </div>
      
      {viewAllLink && (
        <Link 
          to={viewAllLink}
          className="text-xs sm:text-sm font-light uppercase tracking-wide text-[#111111] hover:opacity-60 transition-opacity duration-300 flex items-center gap-2"
        >
          {viewAllText}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </div>
  )
}

export default SectionHeader


