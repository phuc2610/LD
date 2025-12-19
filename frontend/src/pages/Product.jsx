import React, { useContext, useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import {ShopContext}  from '../context/ShopContext';
import { assets } from '../assets/assets'
import RelatedProducts from '../components/RelatedProducts';
import RatingStars from '../components/RatingStars';
import axios from 'axios';
import { toast } from 'react-toastify';
const Product = () => {

  const {productId} = useParams();
  const {products , currency , addToCart, token, backendUrl, toggleWishlist, isInWishlist} = useContext(ShopContext);
  const [productData ,setProductData] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [size, setSize] = useState('');
  const [reviews, setReviews] = useState([]);
  const [canReview, setCanReview] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewImages, setReviewImages] = useState([]);
  const [activeTab, setActiveTab] = useState('desc');
  const [zoom, setZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [loadingRating, setLoadingRating] = useState(false);
  const [soldQuantity, setSoldQuantity] = useState(0);
  const [loadingSold, setLoadingSold] = useState(false);
  const isWishlisted = productData ? isInWishlist(productData._id) : false;

  useEffect(() => {
    if (products && products.length > 0) {
      const product = products.find((item) => item._id === productId);
      if (product) {
        setProductData(product);
        setCurrentImageIndex(0);
        
        // Auto-select size if product has only 1 size or no sizes
        if (product.sizes && product.sizes.length === 1) {
          setSize(product.sizes[0]);
        } else if (!product.sizes || product.sizes.length === 0) {
          // If no sizes, set a default value to allow adding to cart
          setSize('ONE_SIZE');
        }
      }
    }
  }, [productId, products]);

  const handleImageChange = (index) => {
    setCurrentImageIndex(index);
  };

  const handlePrevImage = () => {
    if (productData && productData.image) {
      setCurrentImageIndex((prev) => (prev - 1 + productData.image.length) % productData.image.length);
    }
  };

  const handleNextImage = () => {
    if (productData && productData.image) {
      setCurrentImageIndex((prev) => (prev + 1) % productData.image.length);
    }
  };

  const handleMouseMove = (e) => {
    if (!zoom) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

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

  // Load rating summary
  const loadRatingSummary = React.useCallback(async () => {
    if (!productId) return;
    
    setLoadingRating(true);
    try {
      const res = await axios.get(`${backendUrl}/api/review/summary/${productId}`);
      if (res.data.success) {
        setAvgRating(res.data.avgRating || 0);
        setReviewCount(res.data.reviewCount || 0);
      }
    } catch (error) {
      console.log(error);
      // Fallback to 0 if API fails
      setAvgRating(0);
      setReviewCount(0);
    } finally {
      setLoadingRating(false);
    }
  }, [backendUrl, productId]);

  useEffect(() => {
    loadRatingSummary();
  }, [loadRatingSummary]);

  // Load sold quantity
  const loadSoldQuantity = React.useCallback(async () => {
    if (!productId) return;
    
    setLoadingSold(true);
    try {
      const res = await axios.get(`${backendUrl}/api/product/${productId}/sold`);
      if (res.data.success) {
        setSoldQuantity(res.data.soldQuantity || 0);
      }
    } catch (error) {
      console.log(error);
      setSoldQuantity(0);
    } finally {
      setLoadingSold(false);
    }
  }, [backendUrl, productId]);

  useEffect(() => {
    loadSoldQuantity();
  }, [loadSoldQuantity]);

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
        loadRatingSummary(); // Update rating summary after submitting review
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return productData ? (
    <div className='bg-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>
        {/* Product Data */}
        <div className='flex gap-8 sm:gap-12 lg:gap-16 flex-col lg:flex-row mb-16 sm:mb-20'>

          {/* Product Images */}
          <div className='flex-1 flex flex-col-reverse gap-4 sm:flex-row'>
            {/* Thumbnails */}
            <div className='flex sm:flex-col gap-3 sm:w-[18%] overflow-x-auto sm:overflow-y-auto sm:max-h-[600px] 
              scrollbar-hide sm:scrollbar-thin sm:scrollbar-thumb-[#e5e5e5] sm:scrollbar-track-transparent'>
              {
                productData.image.map((item,index)=>(
                  <img 
                    onClick={() => handleImageChange(index)} 
                    src={item} 
                    key={index} 
                    className={`flex-shrink-0 cursor-pointer border-2 transition-all duration-300 w-16 h-16 sm:w-full sm:h-auto object-cover ${
                      currentImageIndex === index 
                        ? 'border-[#111111] shadow-sm' 
                        : 'border-[#e5e5e5] hover:border-[#111111] hover:shadow-sm'
                    }`} 
                    alt={`${productData.name} - ${index + 1}`} 
                  />
                ))
              }
            </div>

            {/* Main Image with Zoom */}
            <div className='w-full sm:w-[82%] relative overflow-hidden bg-[#f9f9f9] group'>
              {/* Image Container */}
              <div 
                className='relative w-full aspect-square overflow-hidden'
                onMouseEnter={() => setZoom(true)}
                onMouseLeave={() => setZoom(false)}
                onMouseMove={handleMouseMove}
              >
                {/* All Images with Slide Effect */}
                {productData.image.map((img, index) => {
                  const isActive = index === currentImageIndex;
                  const isNext = index === (currentImageIndex + 1) % productData.image.length;
                  
                  return (
                    <img 
                      key={index}
                      className={`absolute inset-0 w-full h-full object-cover
                        transition-all duration-700 ease-in-out
                        ${isActive 
                          ? 'opacity-100 translate-x-0 scale-100 z-10' 
                          : isNext
                          ? 'opacity-0 translate-x-full scale-105 z-0'
                          : 'opacity-0 -translate-x-full scale-105 z-0'
                        }`}
                      src={img} 
                      alt={`${productData.name} - ${index + 1}`}
                      style={zoom && isActive ? {
                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        transform: 'scale(2)',
                        transition: 'transform 0.1s ease-out'
                      } : {}}
                    />
                  );
                })}

                {/* Navigation Buttons */}
                {productData.image.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className='absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm 
                        border border-[#e5e5e5] flex items-center justify-center
                        hover:bg-white hover:border-[#111111] transition-all duration-300
                        opacity-0 group-hover:opacity-100 shadow-sm'
                      aria-label="Previous image"
                    >
                      <svg className='w-5 h-5 text-[#111111]' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={handleNextImage}
                      className='absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm 
                        border border-[#e5e5e5] flex items-center justify-center
                        hover:bg-white hover:border-[#111111] transition-all duration-300
                        opacity-0 group-hover:opacity-100 shadow-sm'
                      aria-label="Next image"
                    >
                      <svg className='w-5 h-5 text-[#111111]' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}

                {/* Zoom Indicator */}
                {zoom && (
                  <div className='absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-black/70 text-white px-3 py-1.5 
                    text-xs font-light uppercase tracking-wide animate-fadeIn'>
                    Di chuyển chuột để phóng to
                  </div>
                )}
              </div>
            </div>        
          </div>
          
          {/* Product Info - Sticky on Desktop */}
          <div className='flex-1 lg:max-w-md'>
            <div className='lg:sticky lg:top-24 space-y-6'>
            <div className='flex items-start justify-between gap-4'>
              <h1 className='text-xl sm:text-2xl lg:text-3xl font-light uppercase tracking-wider text-[#111111] flex-1'>
                {productData.name}
              </h1>
              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(productData._id)}
                className='flex-shrink-0 w-10 h-10 flex items-center justify-center
                  border border-[#e5e5e5] bg-white
                  hover:border-[#111111] hover:bg-[#f9f9f9]
                  transition-all duration-300
                  group/wishlist'
                aria-label={isWishlisted ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
              >
                <svg 
                  className={`w-5 h-5 transition-all duration-300 ${
                    isWishlisted 
                      ? 'fill-[#ef4444] text-[#ef4444] scale-110' 
                      : 'fill-none text-[#111111] group-hover/wishlist:scale-110'
                  }`}
                  stroke="currentColor" 
                  strokeWidth={1.5} 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" 
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" 
                  />
                </svg>
              </button>
            </div>
            
            <div className='flex items-center gap-2 mb-6'>
              <RatingStars value={avgRating} />
              <span className='text-xs text-[#222222] font-light'>
                {avgRating.toFixed(1)} ({reviewCount})
              </span>
            </div>
            
            <p className='text-2xl sm:text-3xl font-light text-[#F5C842] mb-4'>
              {productData.price.toLocaleString('vi-VN')}{currency}
            </p>
            
            <div className='mb-6 pb-6 border-b border-[#e5e5e5]'>
              <p className='text-xs sm:text-sm text-[#222222] font-light mb-2'>
                <span className='opacity-70'>Đã bán:</span>{' '}
                <span className='font-medium text-[#111111]'>
                  {loadingSold ? '...' : soldQuantity.toLocaleString('vi-VN')} sản phẩm
                </span>
              </p>
            </div>
            
            <p className='text-sm text-[#222222] font-light leading-relaxed mb-8 border-b border-[#e5e5e5] pb-8'>
              {productData.description}
            </p>
            
            {/* Only show size selector if product has more than 1 size */}
            {productData.sizes && productData.sizes.length > 1 && (
              <div className='mb-8'>
                <p className='text-xs font-light uppercase tracking-wider text-[#111111] mb-4'>Chọn size</p>
                <div className='flex flex-wrap gap-2'>
                  {productData.sizes.map((item,index)=>(
                    <button 
                      onClick={() => setSize(item)} 
                      className={`border py-2.5 px-6 text-xs font-light uppercase tracking-wider transition-all duration-300 ${
                        item === size 
                          ? 'border-[#111111] bg-[#111111] text-white shadow-sm' 
                          : 'border-[#e5e5e5] bg-white text-[#111111] hover:border-[#111111] hover:bg-[#f9f9f9]'
                      }`} 
                      key={index}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                {!size && (
                  <p className='text-xs text-red-500 mt-2'>Vui lòng chọn size sản phẩm !</p>
                )}
              </div>
            )}
            
            <button 
              onClick={() => {
                // If product has multiple sizes, require selection
                if (productData.sizes && productData.sizes.length > 1 && !size) {
                  toast.error('Vui lòng chọn size sản phẩm !');
                  return;
                }
                // Use the selected size, auto-selected size, or 'ONE_SIZE' for products without sizes
                const selectedSize = size || (productData.sizes && productData.sizes.length === 1 ? productData.sizes[0] : 'ONE_SIZE');
                addToCart(productData._id, selectedSize);
              }} 
              className='w-full bg-[#111111] text-white px-8 py-4 text-xs sm:text-sm font-light uppercase tracking-wider 
                hover:bg-[#222222] hover:shadow-lg hover:-translate-y-0.5
                active:scale-[0.98]
                disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none
                transition-all duration-300 mb-8'
              disabled={productData.sizes && productData.sizes.length > 1 && !size}
            >
              Thêm vào giỏ hàng
            </button>
            
            <div className='border-t border-[#e5e5e5] pt-6'>
              <div className='text-xs text-[#222222] font-light space-y-3 leading-relaxed'>
                <div className='flex items-start gap-2'>
                  <svg className='w-3 h-3 text-[#111111] mt-0.5 flex-shrink-0' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <p>Sản phẩm chính hãng 100%.</p>
                </div>
                <div className='flex items-start gap-2'>
                  <svg className='w-3 h-3 text-[#111111] mt-0.5 flex-shrink-0' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <p>Hỗ trợ giao hàng toàn quốc, thanh toán khi nhận hàng.</p>
                </div>
                <div className='flex items-start gap-2'>
                  <svg className='w-3 h-3 text-[#111111] mt-0.5 flex-shrink-0' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <p>Bảo hành chính hãng, đổi trả dễ dàng trong 7 ngày nếu có lỗi từ nhà sản xuất.</p>
                </div>
                <div className='flex items-start gap-2'>
                  <svg className='w-3 h-3 text-[#111111] mt-0.5 flex-shrink-0' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <p>Tư vấn miễn phí cho mọi khách hàng.</p>
                </div>
              </div>
            </div>
            </div>
          </div>      
        </div>

        {/* Description & Reviews Section */}
        <div className='border-t border-[#e5e5e5] pt-12 mb-16 sm:mb-20'>
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
                        <div className='flex gap-2 flex-wrap mb-3'>
                          {rv.images.map((img, idx)=>(
                            <img key={idx} src={img} alt="review" className='w-20 h-20 object-cover border'/>
                          ))}
                        </div>
                      )}
                      {rv.adminReply && (
                        <div className='mt-3 pt-3 border-t border-[#e5e5e5] bg-[#f9f9f9] p-3 rounded'>
                          <div className='flex items-center gap-2 mb-2'>
                            <svg className='w-4 h-4 text-blue-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className='text-xs font-semibold text-blue-600'>Phản hồi từ quản trị viên</p>
                            {rv.adminReplyAt && (
                              <p className='text-xs text-[#777] ml-auto'>
                                {new Date(rv.adminReplyAt).toLocaleString('vi-VN')}
                              </p>
                            )}
                          </div>
                          <p className='text-sm text-[#222]'>{rv.adminReply}</p>
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