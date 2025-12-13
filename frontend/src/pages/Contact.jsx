import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'
import { useForm, ValidationError } from '@formspree/react';
const Contact = () => {

  const [state, handleSubmit] = useForm("xeokwkeg");
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
            <img className='w-full h-auto object-cover' src={assets.contact_img} alt="Contact TLook" />
          </div>
          <div className='w-full md:w-1/2 flex flex-col gap-6'>
            <h3 className='text-base sm:text-lg font-light uppercase tracking-wider text-[#111111]'>
              Nơi giải đáp toàn bộ mọi thắc mắc của bạn?
            </h3>
            <div className='space-y-3 text-sm text-[#222222] font-light'>
              <p>981 Kim Giang<br />Thanh Trì, Hà Nội, Việt Nam</p>
              <p>Số điện thoại chủ shop: 039 4996777<br />Email: xuanthuc123412@gmail.com</p>
              <p>Hotline: 059 2016789<br />Email: tlook@gmail.com</p>
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
  
        <NewsletterBox />
      </div>
    </div>
  )
}

export default Contact
