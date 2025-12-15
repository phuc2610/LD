import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    navigate, 
    backendUrl, 
    token, 
    cartItems, 
    setCartItems, 
    getCartAmount, 
    delivery_fee, 
    products
  } = useContext(ShopContext);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  });

  // Validation functions
  const validateField = (name, value) => {
    let error = '';
    
    switch(name) {
      case 'email':
        if (!value) {
          error = 'Email là bắt buộc';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Email không hợp lệ';
        }
        break;
      case 'phone':
        if (!value) {
          error = 'Số điện thoại là bắt buộc';
        } else if (!/^[0-9]{10,11}$/.test(value.replace(/\s/g, ''))) {
          error = 'Số điện thoại không hợp lệ';
        }
        break;
      case 'firstName':
      case 'lastName':
        if (!value.trim()) {
          error = 'Trường này là bắt buộc';
        }
        break;
      case 'street':
      case 'city':
      case 'state':
      case 'country':
        if (!value.trim()) {
          error = 'Trường này là bắt buộc';
        }
        break;
      case 'zipcode':
        if (!value) {
          error = 'Mã bưu chính là bắt buộc';
        } else if (!/^[0-9]{5,6}$/.test(value)) {
          error = 'Mã bưu chính không hợp lệ';
        }
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(data => ({ ...data, [name]: value }));
    
    // Real-time validation for touched fields
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors({ ...errors, [name]: error });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    return Object.keys(newErrors).length === 0;
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      toast.error('Vui lòng điền đầy đủ thông tin hợp lệ');
      return;
    }

    setIsSubmitting(true);
    
    try {
      let orderItems = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === items));
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
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
 
      switch(method) {
        case 'cod': {
          const response = await axios.post(backendUrl + '/api/order/place', orderData, {headers: {token}});
          if (response.data.success) {
            setCartItems({});
            toast.success('Đặt hàng thành công!');
            navigate('/orders');
          } else {
            toast.error(response.data.message);
          }
          break;
        }
        case 'stripe': {
          const responseStripe = await axios.post(backendUrl + '/api/order/stripe', orderData, {headers: {token}}); 
          if (responseStripe.data.success) {
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
      toast.error(error.message || 'Có lỗi xảy ra khi đặt hàng');
    } finally {
      setIsSubmitting(false);
    }
  }

  const InputField = ({ name, label, type = 'text', placeholder, required = true, className = '' }) => {
    const hasError = touched[name] && errors[name];
    
    return (
      <div className={className}>
        <label 
          htmlFor={name}
          className="block text-xs font-light uppercase tracking-wider text-[#111111] mb-2"
        >
          {label} {required && <span className="text-[#ef4444]">*</span>}
        </label>
        <input 
          id={name}
          name={name}
          type={type}
          value={formData[name]}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          required={required}
          className={`w-full px-0 py-3 border-0 border-b bg-transparent
            text-sm font-light uppercase tracking-wide text-[#111111]
            placeholder:text-[#222222] placeholder:opacity-40
            focus:outline-none transition-colors duration-300
            ${hasError 
              ? 'border-[#ef4444]' 
              : 'border-[#e5e5e5] focus:border-[#111111]'
            }`}
        />
        {hasError && (
          <p className="text-xs text-[#ef4444] mt-1 animate-fadeIn">
            {errors[name]}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className='bg-white py-8 sm:py-16 lg:py-24'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <form onSubmit={onSubmitHandler} className='flex flex-col lg:flex-row gap-12 lg:gap-16'>
          {/* Left Side - Shipping Info */}
          <div className='flex-1 lg:max-w-lg'>
            <div className='mb-8 lg:mb-12'>
              <Title text1={'Thông tin'} text2={'giao hàng'} />
            </div>
            
            <div className='space-y-6'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                <InputField 
                  name="firstName"
                  label="Họ"
                  placeholder="Nhập họ"
                />
                <InputField 
                  name="lastName"
                  label="Tên"
                  placeholder="Nhập tên"
                />
              </div>
              
              <InputField 
                name="email"
                label="Email"
                type="email"
                placeholder="email@example.com"
              />
              
              <InputField 
                name="street"
                label="Địa chỉ"
                placeholder="Số nhà, tên đường"
              />
              
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                <InputField 
                  name="city"
                  label="Quận/Huyện"
                  placeholder="Quận/Huyện"
                />
                <InputField 
                  name="state"
                  label="Thành phố"
                  placeholder="Thành phố"
                />
              </div>
              
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                <InputField 
                  name="zipcode"
                  label="Mã bưu chính"
                  type="number"
                  placeholder="00000"
                />
                <InputField 
                  name="country"
                  label="Quốc gia"
                  placeholder="Việt Nam"
                />
              </div>
              
              <InputField 
                name="phone"
                label="Số điện thoại"
                type="tel"
                placeholder="0123456789"
              />
            </div>
          </div>

          {/* Right Side - Order Summary & Payment */}
          <div className='flex-1 lg:max-w-md'>
            <div className='sticky top-24 space-y-8'>
              {/* Order Summary */}
              <div className='mb-8'>
                <CartTotal />
              </div>

              {/* Payment Methods */}
              <div className='mb-8'>
                <h3 className='text-sm font-light uppercase tracking-wider text-[#111111] mb-6'>
                  Phương thức thanh toán
                </h3>
                
                <div className='space-y-3'>
                  <div 
                    onClick={() => setMethod('stripe')} 
                    className={`flex items-center gap-4 border p-4 cursor-pointer transition-all duration-300
                      ${method === 'stripe' 
                        ? 'border-[#111111] bg-[#f9f9f9]' 
                        : 'border-[#e5e5e5] hover:border-[#111111]'
                      }`}
                  >
                    <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center flex-shrink-0
                      transition-all duration-300
                      ${method === 'stripe' 
                        ? 'border-[#111111]' 
                        : 'border-[#e5e5e5]'
                      }`}>
                      {method === 'stripe' && (
                        <div className='w-2.5 h-2.5 bg-[#111111] rounded-full animate-fadeIn' />
                      )}
                    </div>
                    <img className='h-5' src={assets.stripe_logo} alt="Stripe" />
                  </div>
                  
                  <div 
                    onClick={() => setMethod('razorpay')} 
                    className={`flex items-center gap-4 border p-4 cursor-pointer transition-all duration-300
                      ${method === 'razorpay' 
                        ? 'border-[#111111] bg-[#f9f9f9]' 
                        : 'border-[#e5e5e5] hover:border-[#111111]'
                      }`}
                  >
                    <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center flex-shrink-0
                      transition-all duration-300
                      ${method === 'razorpay' 
                        ? 'border-[#111111]' 
                        : 'border-[#e5e5e5]'
                      }`}>
                      {method === 'razorpay' && (
                        <div className='w-2.5 h-2.5 bg-[#111111] rounded-full animate-fadeIn' />
                      )}
                    </div>
                    <img className='h-5' src={assets.razorpay_logo} alt="Razorpay" />
                  </div>
                  
                  <div 
                    onClick={() => setMethod('cod')} 
                    className={`flex items-center gap-4 border p-4 cursor-pointer transition-all duration-300
                      ${method === 'cod' 
                        ? 'border-[#111111] bg-[#f9f9f9]' 
                        : 'border-[#e5e5e5] hover:border-[#111111]'
                      }`}
                  >
                    <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center flex-shrink-0
                      transition-all duration-300
                      ${method === 'cod' 
                        ? 'border-[#111111]' 
                        : 'border-[#e5e5e5]'
                      }`}>
                      {method === 'cod' && (
                        <div className='w-2.5 h-2.5 bg-[#111111] rounded-full animate-fadeIn' />
                      )}
                    </div>
                    <p className='text-xs font-light uppercase tracking-wide text-[#111111]'>
                      Thanh toán khi nhận hàng
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type='submit' 
                disabled={isSubmitting}
                className='w-full bg-[#111111] text-white text-xs sm:text-sm font-light uppercase tracking-wider 
                  py-4 hover:bg-[#222222] hover:shadow-lg hover:-translate-y-0.5
                  active:scale-[0.98]
                  disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0
                  transition-all duration-300 flex items-center justify-center gap-2'
              >
                {isSubmitting ? (
                  <>
                    <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  'Đặt hàng'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PlaceOrder
