import React, { useEffect, useContext, useCallback } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
const Verify = () => {

    const { navigate , token , setCartItems ,  backendUrl} = useContext(ShopContext)

    const [searchParams] = useSearchParams();

    const success = searchParams.get('success');
    const orderId = searchParams.get('orderId');


    const verifyPayment = useCallback( async () => {

        try {
            if(!token) {
                return null;
            }

            const response = await axios.post(backendUrl + '/api/order/verifyStripe',{success,orderId},{headers:{token}});

            if(response.data.success){
                setCartItems({});
                navigate('/orders');
            } else {
                navigate('/cart');
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
            
        }

    },[token, success, orderId, backendUrl, navigate, setCartItems])

    useEffect(() => {
        verifyPayment();
    }, [verifyPayment]);


  return (
    <div className='bg-white min-h-screen flex items-center justify-center'>
      <div className='text-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-2 border-[#e5e5e5] border-t-black mx-auto mb-4'></div>
        <p className='text-sm font-light uppercase tracking-wide text-[#111111]'>Đang xác thực thanh toán...</p>
      </div>
    </div>
  )
}

export default Verify