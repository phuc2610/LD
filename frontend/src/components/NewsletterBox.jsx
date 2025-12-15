import React from 'react'

const NewsletterBox = () => {

    const onSubmitHandler = (event) => {
    event.preventDefault();
    }

  return (
    <section className='w-full py-20 sm:py-24 lg:py-32 border-t border-[#e5e5e5] bg-[#f9f9f9]'>
      <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center'>
        <p className='text-xl sm:text-2xl lg:text-3xl font-light uppercase tracking-wider text-[#111111] mb-3'>
          Đăng ký ngay & giảm giá 15%
        </p>
        <p className='text-xs sm:text-sm text-[#222222] font-light mb-8 sm:mb-12 leading-relaxed max-w-2xl mx-auto'>
          Chỉ cần đăng ký tài khoản, bạn sẽ nhận ngay mã giảm giá 15% cho đơn hàng đầu tiên.
          Nhanh tay – số lượng ưu đãi có hạn!
        </p>
        <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-lg mx-auto'>
          <input 
            className='flex-1 w-full sm:w-auto min-w-[280px] border-b border-[#111111] bg-transparent px-2 py-3 text-xs sm:text-sm font-light uppercase tracking-wide text-[#111111] placeholder:text-[#222222] placeholder:opacity-50 focus:outline-none' 
            type="email" 
            placeholder='Nhập email của bạn' 
            required 
          />
          <button 
            type='submit' 
            className='w-full sm:w-auto bg-[#111111] text-white text-xs sm:text-sm font-light uppercase tracking-wider py-3 px-8 sm:px-12 hover:bg-[#222222] hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300'
          >
            Đăng ký
          </button>
        </form>
      </div>
    </section>
  )
}

export default NewsletterBox