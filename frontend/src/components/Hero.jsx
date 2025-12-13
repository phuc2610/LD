import React from 'react'
import { assets } from '../assets/assets'

const Hero = () => {
  return (
    <div className='relative w-full bg-white overflow-hidden'>
        {/* Hero Image */}
        <div className='relative w-full aspect-[16/9] sm:aspect-[21/9]'>
            <img 
                className='w-full h-full object-cover' 
                src={assets.dior} 
                alt="TLook Collection" 
            />
            <div className='absolute inset-0 bg-black/20'></div>
            
            {/* Hero Content Overlay */}
            <div className='absolute inset-0 flex items-center justify-center sm:justify-start'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full'>
                    <div className='max-w-md'>
                        <p className='text-xs sm:text-sm font-light uppercase tracking-[0.2em] text-white mb-4'>
                            Sản phẩm bán chạy nhất
                        </p>
                        <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light uppercase tracking-wider text-white mb-6 leading-tight'>
                            Hàng mới nhất
                        </h1>
                        <button className='bg-black text-white px-8 py-3 text-xs sm:text-sm font-light uppercase tracking-wider hover:opacity-80 transition-opacity'>
                            Mua sắm ngay
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Hero