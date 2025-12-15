import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

const Hero = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const heroImages = [assets.br1, assets.br2, assets.br3];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 1500); // Chuyển ảnh mỗi 1.5 giây

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <div className='relative w-full bg-white overflow-hidden'>
        {/* Hero Image Carousel */}
        <div className='relative w-full aspect-[16/9] sm:aspect-[21/9] lg:aspect-[24/9] overflow-hidden'>
            <div 
              className='flex transition-transform duration-700 ease-in-out h-full'
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {heroImages.map((img, index) => (
                <div 
                  key={index}
                  className='min-w-full h-full relative'
                >
                  <img 
                    className='w-full h-full object-cover' 
                    src={img} 
                    alt={`Hero ${index + 1}`} 
                  />
                  <div className='absolute inset-0 bg-black/20'></div>
                </div>
              ))}
            </div>
            
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
                        <button 
                          onClick={() => navigate('/collection')}
                          className='bg-[#111111] text-white px-8 py-3 text-xs sm:text-sm font-light uppercase tracking-wider hover:bg-[#222222] transition-colors duration-300'
                        >
                            Mua sắm ngay
                        </button>
                        
                        {/* Trust Badges */}
                        <div className='mt-8 flex flex-wrap items-center gap-4 sm:gap-6'>
                          <div className='flex items-center gap-2 text-white/90'>
                            <svg className='w-4 h-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className='text-[10px] sm:text-xs font-light uppercase tracking-wide'>Miễn phí vận chuyển</span>
                          </div>
                          <div className='flex items-center gap-2 text-white/90'>
                            <svg className='w-4 h-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className='text-[10px] sm:text-xs font-light uppercase tracking-wide'>Đổi trả dễ dàng</span>
                          </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Hero