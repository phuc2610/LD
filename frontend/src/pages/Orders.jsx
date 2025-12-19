import React, { useContext, useCallback, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import { useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Orders = () => {

  const {backendUrl , token , currency, navigate} = useContext(ShopContext);

  const [orderData,setorderData] = useState([]);
  const [reviewModal, setReviewModal] = useState({ open:false, productId:null, size:'', rating:5, comment:'', images:[] });

  const loadOrderData = useCallback(async () => {
    try {
      if(!token){
          return null;
      }

      const response = await axios.post(backendUrl + '/api/order/userorders',{},{headers:{token}});
      if (response.data.success){
        let allOrdersItem = []
        response.data.orders.map((order) => {
            order.items.map((item)=>{
              item['status'] = order.status
              item['payment'] = order.payment
              item['paymentMethod'] = order.paymentMethod
              item['createdAt'] = order.createdAt
              // item['date'] = order.date
              allOrdersItem.push(item)
            })
        })
        setorderData(allOrdersItem.reverse());
        
      }
      

    } catch (error) {
      console.log(error);
    }
  },[token, backendUrl])

  useEffect(() =>{
    loadOrderData();
  },[loadOrderData])

  const openReview = (item) => {
    setReviewModal({
      open:true,
      productId:item._id,
      size:item.size,
      rating:5,
      comment:'',
      images:[]
    });
  };

  const closeReviewModal = useCallback(() => {
    setReviewModal({open:false, productId:null, size:'', rating:5, comment:'', images:[]});
  }, []);

  const submitReview = async (e) => {
    e.preventDefault();
    if(!token) {
      toast.error("Vui lòng đăng nhập");
      return;
    }
    try {
      const formData = new FormData();
      formData.append('productId', reviewModal.productId);
      formData.append('rating', reviewModal.rating);
      formData.append('comment', reviewModal.comment);
      if (reviewModal.size) formData.append('size', reviewModal.size);
      reviewModal.images.forEach(f => formData.append('images', f));
      const res = await axios.post(backendUrl + '/api/review/add', formData, {
        headers:{ token, 'Content-Type':'multipart/form-data' }
      });
      if(res.data.success){
        toast.success("Đã gửi đánh giá");
        closeReviewModal();
        // Reload order data to reflect changes
        loadOrderData();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && reviewModal.open) {
        closeReviewModal();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [reviewModal.open, closeReviewModal]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (reviewModal.open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [reviewModal.open]);

  return (
    <div className='bg-white py-8 sm:py-16 pb-24 sm:pb-32 lg:pb-40'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mb-8'>
          <Title text1={'Đơn hàng'} text2={'của tôi'} />
        </div>

        {orderData.length === 0 ? (
          <div className="text-center py-16 sm:py-24">
            <svg className="w-16 h-16 mx-auto text-[#e5e5e5] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm sm:text-base text-[#222222] font-light mb-4">Bạn chưa có đơn hàng nào</p>
            <button
              onClick={() => navigate("/collection")}
              className="inline-block bg-[#111111] text-white px-6 py-3 text-xs sm:text-sm font-light uppercase tracking-wider hover:bg-[#222222] transition-colors duration-300"
            >
              Mua sắm ngay
            </button>
          </div>
        ) : (
          <div className='space-y-0 border-t border-[#e5e5e5]'>
            {
              orderData.map((item,index) =>(
                <div key={index} className='py-6 sm:py-8 border-b border-[#e5e5e5] flex flex-col md:flex-row md:items-center md:justify-between gap-6 hover:bg-[#fafafa] transition-colors duration-300'>
                  <div className='flex items-start gap-4 sm:gap-6 flex-1'>
                    <img className='w-24 sm:w-28 h-24 sm:h-28 object-cover border border-[#e5e5e5] flex-shrink-0' src={item.image[0]} alt={item.name} />
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm sm:text-base font-light uppercase tracking-wide text-[#111111] mb-3 line-clamp-2'>{item.name}</p>
                      <div className='flex items-center gap-4 flex-wrap text-xs sm:text-sm text-[#222222] font-light mb-3'>
                        <span className='text-base sm:text-lg text-[#F5C842] font-light'>{item.price.toLocaleString('vi-VN')}{currency}</span>
                        <span>Số lượng: {item.quantity}</span>
                        <span className='border border-[#e5e5e5] px-3 py-1.5 uppercase tracking-wide bg-white'>Size: {item.size}</span>
                      </div>
                      <div className='space-y-1 text-xs text-[#222222] font-light'>
                        <p>
                          Ngày đặt: <span className='opacity-70'>{new Date(item.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                        </p>
                        <p>
                          Phương thức: <span className='opacity-70 uppercase'>{item.paymentMethod}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 md:w-auto'>
                    <div className='flex items-center gap-2 px-3 py-1.5 border border-[#e5e5e5] bg-white'>
                      <div className='w-2 h-2 rounded-full bg-[#111111]'></div>
                      <p className='text-xs sm:text-sm font-light uppercase tracking-wide text-[#111111]'>{item.status}</p>
                    </div>
                    <div className='flex gap-2'>
                      <button 
                        onClick={loadOrderData} 
                        className='border border-[#e5e5e5] px-4 py-2.5 text-xs font-light uppercase tracking-wide hover:border-[#111111] hover:bg-[#111111] hover:text-white transition-all duration-300'
                      >
                        Theo dõi đơn hàng
                      </button>
                      {["Đã giao hàng","completed","delivered"].includes(item.status) && (
                        <button
                          onClick={()=>openReview(item)}
                          className='border border-[#111111] bg-[#111111] text-white px-4 py-2.5 text-xs font-light uppercase tracking-wide hover:bg-[#222222] transition-all duration-300'
                        >
                          Đánh giá
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        )}
      </div>

      {reviewModal.open && (
        <div 
          className='fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-[9999] px-4 animate-fadeIn'
          onClick={closeReviewModal}
        >
          <div 
            className='bg-white p-6 w-full max-w-md rounded shadow-lg max-h-[90vh] overflow-y-auto animate-fadeIn'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-base font-semibold'>Đánh giá sản phẩm</h3>
              <button
                type="button"
                onClick={closeReviewModal}
                className='text-[#222222] hover:text-[#111111] transition-colors'
                aria-label="Close"
              >
                <svg className='w-5 h-5' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={submitReview} className='space-y-4'>
              <div>
                <p className='text-xs uppercase tracking-wide text-[#111111] mb-2'>Chọn sao</p>
                <div className='flex gap-2'>
                  {[1,2,3,4,5].map(star => {
                    const isSelected = reviewModal.rating >= star;
                    return (
                      <button
                        type="button"
                        key={star}
                        onClick={() => {
                          setReviewModal(prev => ({...prev, rating: star}));
                        }}
                        className={`w-8 h-8 flex items-center justify-center border transition-all duration-200 ${
                          isSelected 
                            ? 'bg-[#111111] text-white border-[#111111]' 
                            : 'bg-white text-[#111111] border-[#e5e5e5] hover:border-[#111111] hover:bg-[#f9f9f9]'
                        }`}
                        aria-label={`${star} sao`}
                      >
                        ★
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <p className='text-xs uppercase tracking-wide text-[#111111] mb-2'>Nhận xét</p>
                <textarea
                  value={reviewModal.comment}
                  onChange={(e)=>setReviewModal(prev=>({...prev, comment:e.target.value}))}
                  required
                  className='w-full border border-[#e5e5e5] p-3 text-sm focus:outline-none focus:border-black transition-colors'
                  rows={4}
                  placeholder='Chia sẻ trải nghiệm của bạn...'
                />
              </div>
              <div>
                <p className='text-xs uppercase tracking-wide text-[#111111] mb-2'>Ảnh minh họa (tùy chọn)</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e)=> setReviewModal(prev=>({...prev, images: Array.from(e.target.files || [])}))}
                  className='text-sm w-full'
                />
              </div>
              <div className='flex justify-end gap-2 pt-2'>
                <button 
                  type='button' 
                  onClick={closeReviewModal} 
                  className='px-4 py-2 text-sm border border-[#e5e5e5] hover:border-[#111111] transition-colors'
                >
                  Hủy
                </button>
                <button 
                  type='submit' 
                  className='px-4 py-2 text-sm bg-black text-white hover:bg-[#222222] transition-colors'
                >
                  Gửi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders