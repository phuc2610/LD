import React from 'react'

const Loading = ({ size = 'medium', text = 'Đang tải...', fullScreen = false }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  }

  const LoadingComponent = (
    <div className='flex flex-col items-center justify-center gap-4'>
      <div className={`${sizeClasses[size]} border-2 border-[#e5e5e5] border-t-black rounded-full animate-spin`}></div>
      {text && (
        <p className='text-[#222222] text-xs font-light uppercase tracking-wide animate-pulse'>{text}</p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className='fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50'>
        {LoadingComponent}
      </div>
    )
  }

  return LoadingComponent
}

export default Loading
