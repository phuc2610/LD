import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'

const ProductItem = ({id, image, name, price}) => {
    const {currency} = useContext(ShopContext);
    const [isLoading, setIsLoading] = useState(true);

    return (
        <Link 
            className='group block bg-white border border-[#e5e5e5] hover:border-black transition-all duration-300 hover:-translate-y-1' 
            to={`/product/${id}`}
        >
            {/* Image Container */}
            <div className='relative overflow-hidden bg-[#f9f9f9] aspect-square'>
                {/* Loading Skeleton */}
                {isLoading && (
                    <div className='absolute inset-0 bg-[#e5e5e5] animate-pulse'></div>
                )}
                
                <img 
                    className='w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500' 
                    src={image[0]} 
                    alt={name}
                    onLoad={() => setIsLoading(false)}
                    style={{display: isLoading ? 'none' : 'block'}}
                />
                
                {/* New Arrival Badge */}
                <div className='absolute top-3 left-3 bg-black text-white px-2 py-1 text-[10px] font-light uppercase tracking-wider'>
                    New arrival
                </div>
            </div>
            
            {/* Product Info */}
            <div className='p-4 bg-white'>
                <h3 className='text-[#111111] font-light text-xs sm:text-sm leading-tight mb-2 line-clamp-2 uppercase tracking-wide'>
                    {name}
                </h3>
                
                <div className='flex items-center justify-between'>
                    <p className='text-sm sm:text-base font-light text-[#F5C842]'>
                        {price.toLocaleString('vi-VN')}{currency}
                    </p>
                </div>
            </div>
        </Link>
    )
}

export default ProductItem