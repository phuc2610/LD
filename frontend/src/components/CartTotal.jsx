import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';

const CartTotal = () => {

    const {currency , delivery_fee , getCartAmount} = useContext(ShopContext);


  return (
    <div className='w-full border border-[#e5e5e5] p-6 bg-white'>
        <h3 className='text-sm font-light uppercase tracking-wider text-[#111111] mb-6'>
            Tổng tiền giỏ hàng
        </h3>

        <div className='space-y-4 text-sm'>
            <div className='flex justify-between text-[#222222] font-light'>
                <span>Tạm tính</span>
                <span>{getCartAmount().toLocaleString('vi-VN')}{currency}</span>
            </div>
            <div className='border-t border-[#e5e5e5]'></div>
            <div className='flex justify-between text-[#222222] font-light'>
                <span>Phí giao hàng</span>
                <span>{delivery_fee.toLocaleString('vi-VN')}{currency}</span>
            </div>
            <div className='border-t border-[#111111] pt-4'>
                <div className='flex justify-between text-[#111111] font-light'>
                    <span className='uppercase tracking-wide'>Tổng tiền</span>
                    <span className='text-[#F5C842]'>
                        {getCartAmount() === 0 ? 0 : (getCartAmount() + delivery_fee).toLocaleString('vi-VN')}{currency}
                    </span>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CartTotal