import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'
import axios from 'axios'


const PlaceOrder = () => {

  const [method,setMethod] = useState('cod');
  const {navigate ,  backendUrl , token , cartItems , setCartItems , getCartAmount, delivery_fee , products} = useContext(ShopContext);
  const [formData , setFormData] = useState({
    firstName:'',
    lastName:'',
    email:'',
    street:'',
    city:'',
    state:'',
    zipcode:'',
    country:'',
    phone:''
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value

    setFormData(data => ({...data , [name]:value}));

  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      let orderItems = [];
      for( const items in cartItems) {
        for (const item in cartItems[items]){
          if(cartItems[items][item] > 0){
            const itemInfo = structuredClone(products.find(product => product._id === items));
            if(itemInfo){
              itemInfo.size = item
              itemInfo.quantity = cartItems[items][item]
              orderItems.push(itemInfo);
            }
          }
        }
      }
     
      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee
      }
 
      switch(method){

        // API calls for COD
        case 'cod': {
            const response = await axios.post(backendUrl + '/api/order/place', orderData,{headers:{token}});
       
            if(response.data.success){
              setCartItems({});
              navigate('/orders');
            } else {
              toast.error(response.data.message);
            }
            break;
        }

          case 'stripe': {
              const responseStripe = await axios.post(backendUrl + '/api/order/stripe' , orderData , {headers:{token}}); 
              if(responseStripe.data.success){
                const {session_url} = responseStripe.data;
                window.location.replace(session_url);
              } else {
                toast.error(responseStripe.data.message);
              }

            break;
          }

            
        default:
          break;

      }
      

    } catch (error) {
      console.log(error);
      toast.error(error.message);
      
    }
  }

  return (
    <div className='bg-white py-8 sm:py-16'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <form onSubmit={onSubmitHandler} className='flex flex-col lg:flex-row gap-8 lg:gap-12'>
          {/* Left Side - Shipping Info */}
          <div className='flex-1 lg:max-w-lg'>
            <div className='mb-8'>
              <Title text1={'Thông tin'} text2={'giao hàng'} />
            </div>
            
            <div className='space-y-4'>
              <div className='flex gap-3'>
                <input 
                  required 
                  onChange={onChangeHandler} 
                  name='firstName' 
                  value={formData.firstName} 
                  className='flex-1 px-0 py-3 border-b border-[#e5e5e5] bg-transparent text-sm font-light uppercase tracking-wide text-[#111111] placeholder:text-[#222222] placeholder:opacity-50 focus:outline-none focus:border-black transition-colors' 
                  type="text" 
                  placeholder='Họ' 
                />
                <input 
                  required 
                  onChange={onChangeHandler} 
                  name='lastName' 
                  value={formData.lastName} 
                  className='flex-1 px-0 py-3 border-b border-[#e5e5e5] bg-transparent text-sm font-light uppercase tracking-wide text-[#111111] placeholder:text-[#222222] placeholder:opacity-50 focus:outline-none focus:border-black transition-colors' 
                  type="text" 
                  placeholder='Tên' 
                />
              </div>
              
              <input 
                required 
                onChange={onChangeHandler} 
                name='email' 
                value={formData.email} 
                className='w-full px-0 py-3 border-b border-[#e5e5e5] bg-transparent text-sm font-light uppercase tracking-wide text-[#111111] placeholder:text-[#222222] placeholder:opacity-50 focus:outline-none focus:border-black transition-colors' 
                type="email" 
                placeholder='Email' 
              />
              
              <input 
                required 
                onChange={onChangeHandler} 
                name='street' 
                value={formData.street} 
                className='w-full px-0 py-3 border-b border-[#e5e5e5] bg-transparent text-sm font-light uppercase tracking-wide text-[#111111] placeholder:text-[#222222] placeholder:opacity-50 focus:outline-none focus:border-black transition-colors' 
                type="text" 
                placeholder='Địa chỉ nhà' 
              />
              
              <div className='flex gap-3'>
                <input 
                  required 
                  onChange={onChangeHandler} 
                  name='city' 
                  value={formData.city} 
                  className='flex-1 px-0 py-3 border-b border-[#e5e5e5] bg-transparent text-sm font-light uppercase tracking-wide text-[#111111] placeholder:text-[#222222] placeholder:opacity-50 focus:outline-none focus:border-black transition-colors' 
                  type="text" 
                  placeholder='Quận, huyện' 
                />
                <input 
                  required 
                  onChange={onChangeHandler} 
                  name='state' 
                  value={formData.state} 
                  className='flex-1 px-0 py-3 border-b border-[#e5e5e5] bg-transparent text-sm font-light uppercase tracking-wide text-[#111111] placeholder:text-[#222222] placeholder:opacity-50 focus:outline-none focus:border-black transition-colors' 
                  type="text" 
                  placeholder='Thành phố' 
                />
              </div>
              
              <div className='flex gap-3'>
                <input 
                  required 
                  onChange={onChangeHandler} 
                  name='zipcode' 
                  value={formData.zipcode} 
                  className='flex-1 px-0 py-3 border-b border-[#e5e5e5] bg-transparent text-sm font-light uppercase tracking-wide text-[#111111] placeholder:text-[#222222] placeholder:opacity-50 focus:outline-none focus:border-black transition-colors' 
                  type="number" 
                  placeholder='Mã bưu chính' 
                />
                <input 
                  required 
                  onChange={onChangeHandler} 
                  name='country' 
                  value={formData.country} 
                  className='flex-1 px-0 py-3 border-b border-[#e5e5e5] bg-transparent text-sm font-light uppercase tracking-wide text-[#111111] placeholder:text-[#222222] placeholder:opacity-50 focus:outline-none focus:border-black transition-colors' 
                  type="text" 
                  placeholder='Quốc gia' 
                />
              </div>
              
              <input 
                required 
                onChange={onChangeHandler} 
                name='phone' 
                value={formData.phone} 
                className='w-full px-0 py-3 border-b border-[#e5e5e5] bg-transparent text-sm font-light uppercase tracking-wide text-[#111111] placeholder:text-[#222222] placeholder:opacity-50 focus:outline-none focus:border-black transition-colors' 
                type="number" 
                placeholder='Số điện thoại' 
              />
            </div>
          </div>

          {/* Right Side - Order Summary & Payment */}
          <div className='flex-1 lg:max-w-md'>
            <div className='mb-8'>
              <CartTotal />
            </div>

            <div className='mb-8'>
              <Title text1={'Phương thức'} text2={'thanh toán'} />
              
              <div className='space-y-3 mt-6'>
                <div 
                  onClick={() => setMethod('stripe')} 
                  className={`flex items-center gap-3 border p-4 cursor-pointer transition-all ${
                    method === 'stripe' ? 'border-black bg-[#f9f9f9]' : 'border-[#e5e5e5] hover:border-[#111111]'
                  }`}
                >
                  <div className={`w-4 h-4 border-2 rounded-full flex items-center justify-center ${
                    method === 'stripe' ? 'border-black' : 'border-[#e5e5e5]'
                  }`}>
                    {method === 'stripe' && <div className='w-2 h-2 bg-black rounded-full'></div>}
                  </div>
                  <img className='h-5' src={assets.stripe_logo} alt="Stripe" />
                </div>
                
                <div 
                  onClick={() => setMethod('razorpay')} 
                  className={`flex items-center gap-3 border p-4 cursor-pointer transition-all ${
                    method === 'razorpay' ? 'border-black bg-[#f9f9f9]' : 'border-[#e5e5e5] hover:border-[#111111]'
                  }`}
                >
                  <div className={`w-4 h-4 border-2 rounded-full flex items-center justify-center ${
                    method === 'razorpay' ? 'border-black' : 'border-[#e5e5e5]'
                  }`}>
                    {method === 'razorpay' && <div className='w-2 h-2 bg-black rounded-full'></div>}
                  </div>
                  <img className='h-5' src={assets.razorpay_logo} alt="Razorpay" />
                </div>
                
                <div 
                  onClick={() => setMethod('cod')} 
                  className={`flex items-center gap-3 border p-4 cursor-pointer transition-all ${
                    method === 'cod' ? 'border-black bg-[#f9f9f9]' : 'border-[#e5e5e5] hover:border-[#111111]'
                  }`}
                >
                  <div className={`w-4 h-4 border-2 rounded-full flex items-center justify-center ${
                    method === 'cod' ? 'border-black' : 'border-[#e5e5e5]'
                  }`}>
                    {method === 'cod' && <div className='w-2 h-2 bg-black rounded-full'></div>}
                  </div>
                  <p className='text-xs font-light uppercase tracking-wide text-[#111111]'>
                    Thanh toán khi nhận hàng
                  </p>
                </div>
              </div>
            </div>

            <button 
              type='submit' 
              className='w-full bg-black text-white text-xs sm:text-sm font-light uppercase tracking-wider py-3 hover:opacity-80 transition-opacity'
            >
              Đặt hàng
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PlaceOrder
