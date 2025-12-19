import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'
import { useForm, ValidationError } from '@formspree/react';
const Contact = () => {

  const [state, handleSubmit] = useForm("mkgvgrpp");
  if (state.succeeded) {
      return <p className='text-center py-16 text-sm font-light text-[#111111]'>Cảm ơn bạn đã gửi lời nhắn cho Shop!</p>;
  }

  return (
    <div className='bg-white py-8 sm:py-16'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mb-12'>
          <Title text1={'Liên hệ'} text2={'về chúng tôi'} />
        </div>

        <div className='flex flex-col md:flex-row gap-8 md:gap-12 mb-16'>
          <div className='w-full md:w-1/2'>
            <img className='w-full h-auto object-cover' src={assets.contact_img} alt="Contact DL Clothing" />
          </div>
          <div className='w-full md:w-1/2 flex flex-col gap-6'>
            <h3 className='text-base sm:text-lg font-light uppercase tracking-wider text-[#111111] mb-4'>
              Liên hệ với chúng tôi
            </h3>
            <div className='space-y-4 text-sm text-[#222222] font-light'>
              <div className='flex items-start gap-3'>
                <svg className='w-5 h-5 flex-shrink-0 mt-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'/>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'/>
                </svg>
                <div>
                  <p className='font-medium text-[#111111] mb-1'>Địa chỉ cửa hàng</p>
                  <p>Hẻm 130 Đường Huỳnh Văn Nghệ<br />Thành phố Biên Hòa, Đồng Nai</p>
                </div>
              </div>
              <div className='flex items-start gap-3'>
                <svg className='w-5 h-5 flex-shrink-0 mt-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'/>
                </svg>
                <div>
                  <p className='font-medium text-[#111111] mb-1'>Hotline</p>
                  <a href="tel:036438891" className='hover:text-[#111111] transition-colors'>036438891</a>
                </div>
              </div>
              <div className='flex items-start gap-3'>
                <svg className='w-5 h-5 flex-shrink-0 mt-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'/>
                </svg>
                <div>
                  <p className='font-medium text-[#111111] mb-1'>Email</p>
                  <a href="mailto:Daitran13062004@gmail.com" className='hover:text-[#111111] transition-colors break-all'>Daitran13062004@gmail.com</a>
                </div>
              </div>
              <div className='flex items-start gap-3'>
                <svg className='w-5 h-5 flex-shrink-0 mt-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'/>
                </svg>
                <div>
                  <p className='font-medium text-[#111111] mb-1'>Giờ làm việc</p>
                  <p>Thứ 2 - Chủ nhật: 9:00 - 21:00</p>
                </div>
              </div>
            </div>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4 mt-4'>
              <div>
                <label htmlFor="email" className='block text-xs font-light uppercase tracking-wide text-[#111111] mb-2'>
                  Email liên hệ của bạn
                </label>
                <input
                  id="email"
                  type="email" 
                  name="email"
                  className='w-full px-0 py-3 border-b border-[#e5e5e5] bg-transparent text-sm font-light uppercase tracking-wide text-[#111111] placeholder:text-[#222222] placeholder:opacity-50 focus:outline-none focus:border-black transition-colors'
                  placeholder='Nhập email của bạn...'
                />
                <ValidationError 
                  prefix="Email" 
                  field="email"
                  errors={state.errors}
                />
              </div>
              <div>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  className='w-full px-0 py-3 border-b border-[#e5e5e5] bg-transparent text-sm font-light uppercase tracking-wide text-[#111111] placeholder:text-[#222222] placeholder:opacity-50 focus:outline-none focus:border-black transition-colors resize-none'
                  placeholder='Hãy để lại lời nhắn của bạn...'
                />
                <ValidationError 
                  prefix="Message" 
                  field="message"
                  errors={state.errors}
                />
              </div>
              <button 
                type="submit" 
                className='w-full sm:w-auto bg-black text-white px-8 py-3 text-xs sm:text-sm font-light uppercase tracking-wider hover:opacity-80 transition-opacity' 
                disabled={state.submitting}
              >
                {state.submitting ? 'Đang gửi...' : 'Gửi'}
              </button>
            </form>
          </div>
        </div>
      </div>
  
      <NewsletterBox />
    </div>
  )
}

export default Contact
