import React from 'react'
import { assets } from '../assets/assets'

const OurPolicy = () => {
  return (
    <div className='py-12 sm:py-16 border-t border-[#e5e5e5]'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 text-center'>
          <div>
            <img src={assets.exchange_icon} className='w-10 h-10 m-auto mb-4 opacity-60' alt="" />
            <p className='text-xs sm:text-sm font-light uppercase tracking-wide text-[#111111] mb-2'>Chính sách đổi trả dễ dàng</p>
            <p className='text-xs text-[#222222] font-light'>Chúng tôi cung cấp chính sách đổi trả dễ dàng</p>
          </div>
          <div>
            <img src={assets.quality_icon} className='w-10 h-10 m-auto mb-4 opacity-60' alt="" />
            <p className='text-xs sm:text-sm font-light uppercase tracking-wide text-[#111111] mb-2'>Đổi trả trong 7 ngày</p>
            <p className='text-xs text-[#222222] font-light'>Chúng tôi cung cấp chính sách trả hàng miễn phí trong 7 ngày</p>
          </div>
          <div>
            <img src={assets.support_img} className='w-10 h-10 m-auto mb-4 opacity-60' alt="" />
            <p className='text-xs sm:text-sm font-light uppercase tracking-wide text-[#111111] mb-2'>Hỗ trợ khách hàng 24/7</p>
            <p className='text-xs text-[#222222] font-light'>Chúng tôi cung cấp hỗ trợ khách hàng tốt nhất</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OurPolicy