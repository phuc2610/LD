import React, { useState, useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProducItem from './ProductItem';

const RelatedProducts = ({category,subCategory}) => {

    const {products} = useContext(ShopContext);
    const[related,setRelated] = useState([]);

    useEffect(() => {

        if(products.length > 0){

            let productsCopy = products.slice();

            productsCopy = productsCopy.filter((item) => category === item.category );
            productsCopy = productsCopy.filter((item) => subCategory === item.subCategory );

            setRelated(productsCopy.slice(0,5));
        }

    },[products, category, subCategory])


  return (
    <div className='pt-12'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <Title text1={'Sản phẩm '} text2={'liên quan'} />
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6'>
          {related.map((item,index)=>(
            <ProducItem key={index} id={item._id} image={item.image} name={item.name} price={item.price}/>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RelatedProducts