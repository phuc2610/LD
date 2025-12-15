import React from 'react'
import { assets } from '../assets/assets'

const OurPolicy = () => {
  return (
    <section className='w-full py-16 sm:py-20 lg:py-24 border-t border-[#e5e5e5] bg-white'>
      <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 lg:gap-16 text-center'>
          <div className='flex flex-col items-center justify-center'>
            <img src={assets.exchange_icon} className='w-12 h-12 sm:w-14 sm:h-14 mb-4 sm:mb-6 opacity-60' alt="Đổi trả dễ dàng" />
            <p className='text-xs sm:text-sm font-light uppercase tracking-wide text-[#111111] mb-2 sm:mb-3'>Chính sách đổi trả dễ dàng</p>
            <p className='text-xs text-[#222222] font-light leading-relaxed max-w-xs mx-auto'>Chúng tôi cung cấp chính sách đổi trả dễ dàng</p>
          </div>
          <div className='flex flex-col items-center justify-center'>
            <img src={assets.quality_icon} className='w-12 h-12 sm:w-14 sm:h-14 mb-4 sm:mb-6 opacity-60' alt="Đổi trả 7 ngày" />
            <p className='text-xs sm:text-sm font-light uppercase tracking-wide text-[#111111] mb-2 sm:mb-3'>Đổi trả trong 7 ngày</p>
            <p className='text-xs text-[#222222] font-light leading-relaxed max-w-xs mx-auto'>Chúng tôi cung cấp chính sách trả hàng miễn phí trong 7 ngày</p>
          </div>
          <div className='flex flex-col items-center justify-center'>
            <img src={assets.support_img} className='w-12 h-12 sm:w-14 sm:h-14 mb-4 sm:mb-6 opacity-60' alt="Hỗ trợ 24/7" />
            <p className='text-xs sm:text-sm font-light uppercase tracking-wide text-[#111111] mb-2 sm:mb-3'>Hỗ trợ khách hàng 24/7</p>
            <p className='text-xs text-[#222222] font-light leading-relaxed max-w-xs mx-auto'>Chúng tôi cung cấp hỗ trợ khách hàng tốt nhất</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default OurPolicy