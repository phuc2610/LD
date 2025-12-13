import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'
const About = () => {
  return (
    <div className='bg-white py-8 sm:py-16'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mb-12'>
          <Title text1={'Giới thiệu'} text2={'về chúng tôi'}/>
        </div>

        <div className='flex flex-col md:flex-row gap-8 md:gap-12 mb-16'>
          <div className='w-full md:w-1/2'>
            <img className='w-full h-auto object-cover' src={assets.about_img} alt="About TLook" />
          </div>
          <div className='w-full md:w-1/2 flex flex-col justify-center gap-6 text-sm sm:text-base text-[#222222] font-light leading-relaxed'>
            <p>
              TLOOK là một thương hiệu trẻ ra đời vào năm 2024, chuyên cung cấp các dòng vợt cầu lông chất lượng cao, phục vụ nhu cầu luyện tập và thi đấu của người chơi ở mọi trình độ – từ phong trào đến chuyên nghiệp.
              Với định hướng "Chất lượng tạo nên khác biệt", TLOOK không chỉ là nơi bán sản phẩm, mà còn là người đồng hành đáng tin cậy của cộng đồng cầu lông tại Việt Nam.
            </p>
            <div>
              <h3 className='text-base sm:text-lg font-light uppercase tracking-wider text-[#111111] mb-2'>Sứ mệnh</h3>
              <p>TLOOK cam kết mang đến cho khách hàng những sản phẩm chính hãng, đa dạng, phù hợp với thể trạng người Việt, đồng thời tư vấn đúng – trúng – tận tâm nhằm giúp người chơi chọn được vợt phù hợp với phong cách và trình độ của mình.</p>
            </div>
            <div>
              <h3 className='text-base sm:text-lg font-light uppercase tracking-wider text-[#111111] mb-2'>Tầm nhìn</h3>
              <p>Chúng tôi hướng đến việc trở thành một trong những địa chỉ bán vợt cầu lông đáng tin cậy nhất tại Việt Nam, với hệ thống phân phối hiện đại và dịch vụ khách hàng chuyên nghiệp, từng bước góp phần phát triển phong trào cầu lông nước nhà.</p>
            </div>
          </div>
        </div>

        <div className='mb-12'>
          <Title text1={'Hãy mua hàng'} text2={'của chúng tôi'}/>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-l border-[#e5e5e5] mb-16'>
          <div className='border-b border-r border-[#e5e5e5] p-8 sm:p-12 flex flex-col gap-4'>
            <h4 className='text-sm sm:text-base font-light uppercase tracking-wider text-[#111111]'>Chất lượng chính hãng, nguồn gốc rõ ràng</h4>
            <p className='text-xs sm:text-sm text-[#222222] font-light leading-relaxed'>Tất cả sản phẩm đều được nhập khẩu hoặc phân phối chính thức, nói không với hàng giả, hàng nhái.</p>
          </div>
          <div className='border-b border-r border-[#e5e5e5] p-8 sm:p-12 flex flex-col gap-4'>
            <h4 className='text-sm sm:text-base font-light uppercase tracking-wider text-[#111111]'>Tư vấn chuẩn theo trình độ người chơi</h4>
            <p className='text-xs sm:text-sm text-[#222222] font-light leading-relaxed'>Đội ngũ am hiểu kỹ thuật, sẵn sàng tư vấn chọn vợt phù hợp với lối đánh, sức tay và kinh nghiệm.</p>
          </div>
          <div className='border-b border-r border-[#e5e5e5] p-8 sm:p-12 flex flex-col gap-4'>
            <h4 className='text-sm sm:text-base font-light uppercase tracking-wider text-[#111111]'>Dịch vụ hậu mãi uy tín – căng vợt, bảo hành tận tâm</h4>
            <p className='text-xs sm:text-sm text-[#222222] font-light leading-relaxed'>Miễn phí căng vợt lần đầu, hỗ trợ bảo hành chính hãng và đổi trả theo quy định rõ ràng.</p>
          </div>
        </div>

        <NewsletterBox/>
      </div>
    </div>
  )
}

export default About