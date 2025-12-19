import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
const About = () => {
  return (
    <div className='bg-white py-8 sm:py-16'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mb-12'>
          <Title text1={'Giới thiệu'} text2={'về chúng tôi'}/>
        </div>

        <div className='flex flex-col md:flex-row gap-8 md:gap-12 mb-16'>
          <div className='w-full md:w-1/2'>
            <img className='w-full h-auto object-cover' src={assets.about_img} alt="About DL Clothing" />
          </div>
          <div className='w-full md:w-1/2 flex flex-col justify-center gap-6 text-sm sm:text-base text-[#222222] font-light leading-relaxed'>
            <p>
              DL Clothing là một thương hiệu thời trang trẻ, ra đời vào năm 2024, chuyên cung cấp các sản phẩm quần áo chất lượng cao với phong cách hiện đại và đa dạng. Chúng tôi tập trung vào việc mang đến cho khách hàng những bộ trang phục không chỉ đẹp mà còn thể hiện được cá tính riêng của mỗi người.
            </p>
            <div>
              <h3 className='text-base sm:text-lg font-light uppercase tracking-wider text-[#111111] mb-2'>Sứ mệnh</h3>
              <p>DL Clothing cam kết mang đến cho khách hàng những sản phẩm thời trang chất lượng cao, đa dạng về phong cách từ casual đến streetwear, phù hợp với xu hướng hiện đại. Chúng tôi không chỉ bán quần áo mà còn giúp bạn thể hiện phong cách cá nhân một cách tự tin nhất.</p>
            </div>
            <div>
              <h3 className='text-base sm:text-lg font-light uppercase tracking-wider text-[#111111] mb-2'>Tầm nhìn</h3>
              <p>Chúng tôi hướng đến việc trở thành một trong những thương hiệu thời trang đáng tin cậy nhất tại Việt Nam, với hệ thống phân phối hiện đại và dịch vụ khách hàng chuyên nghiệp. DL Clothing mong muốn góp phần định hình phong cách thời trang của giới trẻ Việt Nam.</p>
            </div>
          </div>
        </div>

        <div className='mb-12'>
          <Title text1={'Hãy mua hàng'} text2={'của chúng tôi'}/>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-l border-[#e5e5e5] mb-16'>
          <div className='border-b border-r border-[#e5e5e5] p-8 sm:p-12 flex flex-col gap-4'>
            <h4 className='text-sm sm:text-base font-light uppercase tracking-wider text-[#111111]'>Chất lượng cao, nguồn gốc rõ ràng</h4>
            <p className='text-xs sm:text-sm text-[#222222] font-light leading-relaxed'>Tất cả sản phẩm đều được tuyển chọn kỹ lưỡng, đảm bảo chất lượng vải và đường may, nói không với hàng kém chất lượng.</p>
          </div>
          <div className='border-b border-r border-[#e5e5e5] p-8 sm:p-12 flex flex-col gap-4'>
            <h4 className='text-sm sm:text-base font-light uppercase tracking-wider text-[#111111]'>Tư vấn phong cách phù hợp</h4>
            <p className='text-xs sm:text-sm text-[#222222] font-light leading-relaxed'>Đội ngũ tư vấn am hiểu xu hướng thời trang, sẵn sàng giúp bạn chọn lựa trang phục phù hợp với phong cách và sự kiện.</p>
          </div>
          <div className='border-b border-r border-[#e5e5e5] p-8 sm:p-12 flex flex-col gap-4'>
            <h4 className='text-sm sm:text-base font-light uppercase tracking-wider text-[#111111]'>Dịch vụ hậu mãi uy tín – đổi trả dễ dàng</h4>
            <p className='text-xs sm:text-sm text-[#222222] font-light leading-relaxed'>Hỗ trợ đổi trả trong 7 ngày nếu sản phẩm có lỗi từ nhà sản xuất, đảm bảo quyền lợi tối đa cho khách hàng.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About