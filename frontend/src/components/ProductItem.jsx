import React, { useContext, useState, useEffect, useRef } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'

const ProductItem = ({id, image, name, price, bestseller}) => {
    const {currency, toggleWishlist, isInWishlist} = useContext(ShopContext);
    const [isLoading, setIsLoading] = useState(true);
    const [imageError, setImageError] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const intervalRef = useRef(null);
    const isWishlisted = isInWishlist(id);
    
    const hasMultipleImages = image && image.length > 1;
    
    // Auto-slide images on hover (after 1s delay)
    useEffect(() => {
        if (isHovered && hasMultipleImages) {
            // Delay 1 second before starting auto-slide
            const delayTimeout = setTimeout(() => {
                intervalRef.current = setInterval(() => {
                    setCurrentImageIndex((prev) => (prev + 1) % image.length);
                }, 2000); // Change image every 2 seconds
            }, 1000); // Initial 1 second delay
            
            return () => {
                clearTimeout(delayTimeout);
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }
            };
        } else {
            // Reset to first image when not hovered
            setCurrentImageIndex(0);
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }
    }, [isHovered, hasMultipleImages, image?.length]);
    
    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return (
        <Link 
            className='group block bg-white border border-[#e5e5e5] overflow-hidden
              transition-all duration-500 ease-out
              hover:border-[#111111] hover:shadow-lg hover:-translate-y-1' 
            to={`/product/${id}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container */}
            <div className='relative overflow-hidden bg-[#f9f9f9] aspect-square'>
                {/* Loading Skeleton */}
                {isLoading && (
                    <div className='absolute inset-0 bg-gradient-to-br from-[#e5e5e5] via-[#f5f5f5] to-[#e5e5e5] animate-pulse'>
                        <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                          animate-shimmer' />
                    </div>
                )}
                
                {/* Product Images - Auto Slide on Hover */}
                {!imageError && hasMultipleImages ? (
                    <div className='relative w-full h-full overflow-hidden'>
                        {image.map((img, index) => {
                            const isActive = index === currentImageIndex;
                            const isNext = index === (currentImageIndex + 1) % image.length;
                            
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
                                      }
                                      ${isHovered && isActive ? 'scale-105' : ''}`}
                                    src={img} 
                                    alt={`${name} - ${index + 1}`}
                                    onLoad={() => {
                                        if (index === 0) setIsLoading(false);
                                    }}
                                    onError={() => {
                                        if (index === 0) {
                                            setImageError(true);
                                            setIsLoading(false);
                                        }
                                    }}
                                    style={{display: isLoading && index === 0 ? 'none' : 'block'}}
                                />
                            );
                        })}
                    </div>
                ) : !imageError ? (
                    <img 
                        className='w-full h-full object-cover 
                          group-hover:scale-105 
                          transition-transform duration-700 ease-out' 
                        src={image[0]} 
                        alt={name}
                        onLoad={() => setIsLoading(false)}
                        onError={() => {
                            setImageError(true);
                            setIsLoading(false);
                        }}
                        style={{display: isLoading ? 'none' : 'block'}}
                    />
                ) : null}

                {/* Error Placeholder */}
                {imageError && (
                    <div className='w-full h-full flex items-center justify-center bg-[#f9f9f9]'>
                        <svg className='w-12 h-12 text-[#e5e5e5]' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} 
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
                
                {/* Subtle Gradient Overlay on Hover */}
                <div className='absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none' />
                
                {/* Badge - New Arrival */}
                {bestseller && (
                    <div className='absolute top-4 left-4 bg-[#F5C842] text-[#111111] px-2.5 py-1 
                      text-[10px] font-light uppercase tracking-wider shadow-sm z-10
                      animate-fadeIn'>
                        New
                    </div>
                )}

                {/* Wishlist Button */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(id);
                    }}
                    className='absolute top-4 right-4 w-9 h-9 flex items-center justify-center
                      bg-white/90 backdrop-blur-sm rounded-full
                      border border-[#e5e5e5]
                      hover:bg-white hover:border-[#111111]
                      transition-all duration-300 z-10
                      shadow-sm hover:shadow-md
                      group/wishlist'
                    aria-label={isWishlisted ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
                >
                    <svg 
                        className={`w-4 h-4 transition-all duration-300 ${
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

                {/* Quick View Overlay (Optional - can be added later) */}
                <div className='absolute inset-0 bg-black/0 group-hover:bg-black/5 
                  transition-colors duration-500 flex items-center justify-center
                  opacity-0 group-hover:opacity-100 pointer-events-none'>
                    <span className='text-white text-xs font-light uppercase tracking-wider 
                      transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500'>
                        Xem chi tiết
                    </span>
                </div>
            </div>
            
            {/* Product Info */}
            <div className='p-4 sm:p-5 bg-white'>
                <h3 className='text-xs sm:text-sm font-light uppercase tracking-wide text-[#111111] 
                  line-clamp-2 leading-relaxed mb-3 
                  group-hover:text-[#111111] transition-colors duration-300
                  min-h-[2.5rem]'>
                    {name}
                </h3>
                
                <div className='flex items-center justify-between'>
                    <p className='text-sm sm:text-base font-light text-[#F5C842] tracking-wide'>
                        {price.toLocaleString('vi-VN')}{currency}
                    </p>
                </div>
            </div>
        </Link>
    )
}

export default ProductItem
