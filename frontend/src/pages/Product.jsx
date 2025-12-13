import React, { useContext, useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import {ShopContext}  from '../context/ShopContext';
import { assets } from '../assets/assets'
import RelatedProducts from '../components/RelatedProducts';
import axios from 'axios';
import { toast } from 'react-toastify';
const Product = () => {

  const {productId} = useParams();
  const {products , currency , addToCart, token, backendUrl} = useContext(ShopContext);
  const [productData ,setProductData] = useState(false);
  const [image , setImage] = useState('');
  const [size, setSize] = useState('');
  const [reviews, setReviews] = useState([]);
  const [canReview, setCanReview] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewImages, setReviewImages] = useState([]);
  const [activeTab, setActiveTab] = useState('desc');

  useEffect(() => {
    if (products && products.length > 0) {
      const product = products.find((item) => item._id === productId);
      if (product) {
        setProductData(product);
        setImage(product.image[0]);
      }
    }
  }, [productId, products]);

  const loadReviews = React.useCallback(async () => {
    try {
      const headers = {};
      if (token) headers.token = token;
      const res = await axios.get(`${backendUrl}/api/review/product/${productId}`, { headers });
      if (res.data.success) {
        setReviews(res.data.reviews || []);
        setCanReview(res.data.canReview || false);
      }
    } catch (error) {
      console.log(error);
    }
  }, [backendUrl, productId, token]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Vui lòng đăng nhập để đánh giá");
      return;
    }
    try {
      const formData = new FormData();
      formData.append('productId', productId);
      formData.append('rating', rating);
      formData.append('comment', comment);
      if (size) formData.append('size', size);
      reviewImages.forEach((file) => formData.append('images', file));
      const res = await axios.post(`${backendUrl}/api/review/add`, formData, {
        headers: { token, 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        toast.success("Đã gửi đánh giá");
        setComment('');
        setReviewImages([]);
        setRating(5);
        loadReviews();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return productData ? (
    <div className='bg-white pt-8 pb-16'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Product Data */}
        <div className='flex gap-8 sm:gap-12 lg:gap-16 flex-col lg:flex-row mb-16'>

          {/* Product Images */}
          <div className='flex-1 flex flex-col-reverse gap-4 sm:flex-row'>
            <div className='flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:max-h-[600px] sm:w-[18%]'>
              {
                productData.image.map((item,index)=>(
                  <img 
                    onClick={() => {setImage(item)}} 
                    src={item} 
                    key={index} 
                    className={`flex-shrink-0 cursor-pointer border transition-all ${
                      image === item ? 'border-black' : 'border-[#e5e5e5] hover:border-[#111111]'
                    }`} 
                    alt="" 
                  />
                ))
              }
            </div>
            <div className='w-full sm:w-[82%]'>
              <img className='w-full h-auto object-cover' src={image} alt={productData.name} />
            </div>        
          </div>
          
          {/* Product Info */}
          <div className='flex-1 lg:max-w-md'>
            <h1 className='text-xl sm:text-2xl font-light uppercase tracking-wider text-[#111111] mb-4'>
              {productData.name}
            </h1>
            
            <div className='flex items-center gap-2 mb-6'>
              <div className='flex items-center gap-1'>
                {[...Array(4)].map((_, i) => (
                  <img key={i} src={assets.star_icon} alt="" className="w-3 h-3" />
                ))}
                <img src={assets.star_dull_icon} alt="" className="w-3 h-3" />
              </div>
              <span className='text-xs text-[#222222] font-light'>(122)</span>
            </div>
            
            <p className='text-2xl sm:text-3xl font-light text-[#F5C842] mb-6'>
              {productData.price.toLocaleString('vi-VN')}{currency}
            </p>
            
            <p className='text-sm text-[#222222] font-light leading-relaxed mb-8'>
              {productData.description}
            </p>
            
            <div className='mb-8'>
              <p className='text-xs font-light uppercase tracking-wider text-[#111111] mb-3'>Chọn size</p>
              <div className='flex flex-wrap gap-2'>
                {productData.sizes.map((item,index)=>(
                  <button 
                    onClick={() => setSize(item)} 
                    className={`border py-2 px-6 text-xs font-light uppercase tracking-wider transition-all ${
                      item === size 
                        ? 'border-black bg-black text-white' 
                        : 'border-[#e5e5e5] bg-white text-[#111111] hover:border-black'
                    }`} 
                    key={index}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            
            <button 
              onClick={() => addToCart(productData._id, size)} 
              className='w-full bg-black text-white px-8 py-3 text-xs sm:text-sm font-light uppercase tracking-wider hover:opacity-80 transition-opacity mb-8'
            >
              Thêm vào giỏ hàng
            </button>
            
            <div className='border-t border-[#e5e5e5] pt-6'>
              <div className='text-xs text-[#222222] font-light space-y-2'>
                <p>• Sản phẩm vợt cầu lông chính hãng 100%.</p>
                <p>• Hỗ trợ giao hàng toàn quốc, thanh toán khi nhận hàng.</p>
                <p>• Bảo hành chính hãng, đổi trả dễ dàng trong 7 ngày nếu có lỗi từ nhà sản xuất.</p>
                <p>• Tư vấn chọn vợt phù hợp miễn phí cho mọi khách hàng.</p>
              </div>
            </div>
          </div>      
        </div>

        {/* Description & Reviews Section */}
        <div className='border-t border-[#e5e5e5] pt-12 mb-16'>
          <div className='flex border-b border-[#e5e5e5]'>
            <button
              onClick={()=>setActiveTab('desc')}
              className={`px-6 py-3 text-xs font-light uppercase tracking-wider ${
                activeTab === 'desc' ? 'text-[#111111] border-b-2 border-black -mb-[1px]' : 'text-[#222222]'
              }`}
            >
              Mô tả
            </button>
            <button
              onClick={()=>setActiveTab('reviews')}
              className={`px-6 py-3 text-xs font-light uppercase tracking-wider ${
                activeTab === 'reviews' ? 'text-[#111111] border-b-2 border-black -mb-[1px]' : 'text-[#222222]'
              }`}
            >
              Đánh giá ({reviews.length})
            </button>
          </div>
          <div className='py-8 text-sm text-[#222222] font-light leading-relaxed space-y-8'>
            {activeTab === 'desc' && <p>{productData.description}</p>}

            {activeTab === 'reviews' && (
              <>
                <div className='border border-[#e5e5e5] p-4 sm:p-6'>
                  <h3 className='text-base font-semibold mb-4'>Viết đánh giá</h3>
                  {canReview ? (
                    <form onSubmit={submitReview} className='space-y-4'>
                      <div>
                        <p className='text-xs uppercase tracking-wide text-[#111111] mb-2'>Chọn sao</p>
                        <div className='flex gap-2'>
                          {[1,2,3,4,5].map(star => (
                            <button
                              type="button"
                              key={star}
                              onClick={()=>setRating(star)}
                              className={`w-8 h-8 flex items-center justify-center border ${rating >= star ? 'bg-black text-white' : 'bg-white text-[#111111]'}`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className='text-xs uppercase tracking-wide text-[#111111] mb-2'>Nhận xét</p>
                        <textarea
                          value={comment}
                          onChange={(e)=>setComment(e.target.value)}
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
                          onChange={(e)=> setReviewImages(Array.from(e.target.files || []))}
                          className='text-sm'
                        />
                      </div>
                      <button
                        type='submit'
                        className='bg-black text-white px-4 py-2 text-xs uppercase tracking-wide'
                      >
                        Gửi đánh giá
                      </button>
                    </form>
                  ) : (
                    <p className='text-sm text-[#666]'>Bạn chỉ có thể đánh giá sau khi đơn hàng chứa sản phẩm này đã hoàn thành.</p>
                  )}
                </div>

                <div className='space-y-4'>
                  {reviews.length === 0 && (
                    <p className='text-sm text-[#666]'>Chưa có đánh giá nào.</p>
                  )}
                  {reviews.map((rv)=>(
                    <div key={rv._id} className='border border-[#e5e5e5] p-4'>
                      <div className='flex items-center justify-between mb-2'>
                        <p className='text-sm font-semibold'>{rv.userId?.name || 'Người dùng'}</p>
                        <div className='flex'>
                          {[1,2,3,4,5].map(s=>(
                            <span key={s} className={s <= rv.rating ? 'text-yellow-500' : 'text-gray-300'}>★</span>
                          ))}
                        </div>
                      </div>
                      <p className='text-xs text-[#777] mb-2'>{new Date(rv.createdAt).toLocaleString('vi-VN')}</p>
                      <p className='text-sm text-[#222] mb-3'>{rv.comment}</p>
                      {rv.images && rv.images.length > 0 && (
                        <div className='flex gap-2 flex-wrap'>
                          {rv.images.map((img, idx)=>(
                            <img key={idx} src={img} alt="review" className='w-20 h-20 object-cover border'/>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>              
        </div>

        {/* Related Products */}
        <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
      </div>
    </div>
  ) : <div className='opacity-0'> </div>

}

export default Product