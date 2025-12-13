import React, { useContext,useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';
const BestSeller = () => {
    const {products} = useContext(ShopContext);
    const [bestSeller , setBestSeller] = useState([]);
    
    useEffect(() => {
        const bestProduct = products.filter((item) =>(item.bestseller));
        setBestSeller(bestProduct.slice(-10));
    },[products]);



  return (
    <div className='py-12 sm:py-16'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <Title text1={'Sản phẩm '} text2={'bán chạy nhất '} />

        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6'>
          {
            bestSeller.map((item, index) => (
              <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price}/>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default BestSeller