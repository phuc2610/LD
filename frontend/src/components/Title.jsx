import React from 'react'

const Title = ({text1, text2}) => {
  return (
    <div className='mb-12'>
        <h2 className='text-2xl sm:text-3xl lg:text-4xl font-light uppercase tracking-wider text-[#111111] mb-2'>
            {text1} 
            <span className='text-[#F5C842]'>
                {text2}
            </span>
        </h2>
        <div className='w-12 h-[1px] bg-[#111111]'></div>
    </div>
  )
}

export default Title