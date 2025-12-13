import React from 'react'

const NewsletterBox = () => {

    const onSubmitHandler = (event) => {
    event.preventDefault();
    }

  return (
    <div className='py-12 sm:py-16 border-t border-[#e5e5e5] bg-[#f9f9f9]'>
      <div className='max-w-2xl mx-auto px-4 sm:px-6 text-center'>
        <p className='text-xl sm:text-2xl font-light uppercase tracking-wider text-[#111111] mb-3'>
          Đăng ký ngay & giảm giá 15%
        </p>
        <p className='text-xs sm:text-sm text-[#222222] font-light mb-8 leading-relaxed'>
          Chỉ cần đăng ký tài khoản, bạn sẽ nhận ngay mã giảm giá 15% cho đơn hàng đầu tiên.
          Nhanh tay – số lượng ưu đãi có hạn!
        </p>
        <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto'>
          <input 
            className='flex-1 w-full border-b border-[#111111] bg-transparent px-2 py-3 text-xs sm:text-sm font-light uppercase tracking-wide text-[#111111] placeholder:text-[#222222] placeholder:opacity-50 focus:outline-none' 
            type="email" 
            placeholder='Nhập email của bạn' 
            required 
          />
          <button 
            type='submit' 
            className='w-full sm:w-auto bg-black text-white text-xs font-light uppercase tracking-wider py-3 px-8 hover:opacity-80 transition-opacity'
          >
            Đăng ký
          </button>
        </form>
      </div>
    </div>
  )
}

export default NewsletterBox