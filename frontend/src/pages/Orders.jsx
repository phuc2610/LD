import React, { useContext, useCallback, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import { useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Orders = () => {

  const {backendUrl , token , currency} = useContext(ShopContext);

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
        setReviewModal({open:false, productId:null, size:'', rating:5, comment:'', images:[]});
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }

  return (
    <div className='bg-white py-8 sm:py-16'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mb-8'>
          <Title text1={'Đơn hàng'} text2={'của tôi'} />
        </div>

        <div className='space-y-0 border-t border-[#e5e5e5]'>
          {
            orderData.map((item,index) =>(
              <div key={index} className='py-6 border-b border-[#e5e5e5] flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                <div className='flex items-start gap-4 flex-1'>
                  <img className='w-20 h-20 sm:w-24 sm:h-24 object-cover border border-[#e5e5e5]' src={item.image[0]} alt={item.name} />
                  <div className='flex-1'>
                    <p className='text-sm sm:text-base font-light uppercase tracking-wide text-[#111111] mb-2'>{item.name}</p>
                    <div className='flex items-center gap-4 flex-wrap text-xs sm:text-sm text-[#222222] font-light mb-2'>
                      <span className='text-[#F5C842]'>{item.price.toLocaleString('vi-VN')}{currency}</span>
                      <span>Số lượng: {item.quantity}</span>
                      <span className='border border-[#e5e5e5] px-2 py-1 uppercase tracking-wide'>Size: {item.size}</span>
                    </div>
                    <p className='text-xs text-[#222222] font-light mb-1'>
                      Ngày: <span className='opacity-60'>{new Date(item.createdAt).toLocaleDateString('vi-VN')}</span>
                    </p>
                    <p className='text-xs text-[#222222] font-light'>
                      Phương thức: <span className='opacity-60 uppercase'>{item.paymentMethod}</span>
                    </p>
                  </div>
                </div>
                <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 md:w-auto'>
                  <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 rounded-full bg-black'></div>
                    <p className='text-xs sm:text-sm font-light uppercase tracking-wide text-[#111111]'>{item.status}</p>
                  </div>
                  <div className='flex gap-2'>
                    <button 
                      onClick={loadOrderData} 
                      className='border border-[#e5e5e5] px-4 py-2 text-xs font-light uppercase tracking-wide hover:border-black hover:bg-black hover:text-white transition-all'
                    >
                      Theo dõi đơn hàng
                    </button>
                    {["Đã giao hàng","completed","delivered"].includes(item.status) && (
                      <button
                        onClick={()=>openReview(item)}
                        className='border border-black px-4 py-2 text-xs font-light uppercase tracking-wide hover:bg-black hover:text-white transition-all'
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
      </div>

      {reviewModal.open && (
        <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4'>
          <div className='bg-white p-6 w-full max-w-md rounded shadow-lg'>
            <h3 className='text-base font-semibold mb-4'>Đánh giá sản phẩm</h3>
            <form onSubmit={submitReview} className='space-y-4'>
              <div>
                <p className='text-xs uppercase tracking-wide text-[#111111] mb-2'>Chọn sao</p>
                <div className='flex gap-2'>
                  {[1,2,3,4,5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={()=>setReviewModal(prev=>({...prev, rating:star}))}
                      className={`w-8 h-8 flex items-center justify-center border ${reviewModal.rating >= star ? 'bg-black text-white' : 'bg-white text-[#111111]'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className='text-xs uppercase tracking-wide text-[#111111] mb-2'>Nhận xét</p>
                <textarea
                  value={reviewModal.comment}
                  onChange={(e)=>setReviewModal(prev=>({...prev, comment:e.target.value}))}
                  required
                  className='w-full border border-[#e5e5e5] p-3 text-sm focus:outline-none focus:border-black'
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
                  className='text-sm'
                />
              </div>
              <div className='flex justify-end gap-2'>
                <button type='button' onClick={()=>setReviewModal({open:false, productId:null, size:'', rating:5, comment:'', images:[]})} className='px-4 py-2 text-sm border'>
                  Hủy
                </button>
                <button type='submit' className='px-4 py-2 text-sm bg-black text-white'>
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