import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductItem from '../components/ProductItem'
import Title from '../components/Title'

const Wishlist = () => {
  const { wishlist, products } = useContext(ShopContext);
  
  const wishlistProducts = products.filter(product => wishlist.includes(product._id));

  return (
    <div className='bg-white pt-12 sm:pt-16 pb-16 sm:pb-24'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mb-12 sm:mb-16'>
          <Title text1={'Sản phẩm'} text2={'yêu thích'} />
        </div>

        {wishlistProducts.length === 0 ? (
          <div className='text-center py-16 sm:py-24'>
            <svg className='w-16 h-16 mx-auto text-[#e5e5e5] mb-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            <p className='text-sm sm:text-base text-[#222222] font-light mb-4'>Bạn chưa có sản phẩm yêu thích nào</p>
            <button
              onClick={() => window.location.href = '/collection'}
              className='inline-block bg-[#111111] text-white px-6 py-3 text-xs sm:text-sm font-light uppercase tracking-wider hover:bg-[#222222] transition-colors duration-300'
            >
              Khám phá sản phẩm
            </button>
          </div>
        ) : (
          <>
            <p className='text-sm text-[#222222] font-light mb-8'>
              {wishlistProducts.length} sản phẩm yêu thích
            </p>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6'>
              {wishlistProducts.map((product) => (
                <ProductItem
                  key={product._id}
                  id={product._id}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  bestseller={product.bestseller}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Wishlist








