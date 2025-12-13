import React, { useState } from 'react'
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useEffect } from 'react';


const Login = () => {
  
  const [currentState , setCurrentState] = useState('Đăng nhập');
  const {token, setToken , navigate , backendUrl , setUser} = useContext(ShopContext)
  const [name,setName] = useState('');
  const [password,setPassword] = useState('');
  const [email,setEmail] = useState('');


  const onSubmitHandler = async (event) =>{
    event.preventDefault(); 
    try {
      if(currentState === 'Đăng ký'){

        const response = await axios.post(backendUrl + '/api/user/register' , {name,email,password});
         if (response.data.success){
        toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
        setCurrentState('Đăng nhập');
        setName('');
        setPassword('');
        
    } else {
      toast.error(response.data.message);
    }
      }
      else {

        const response  = await axios.post(backendUrl + '/api/user/login' , {email,password});
        if(response.data.success){
          setToken(response.data.token);
          setUser(response.data.user);
          localStorage.setItem('token' , response.data.token);
          localStorage.setItem('user' , JSON.stringify(response.data.user));
        } else {
          toast.error(response.data.message);
        }
        

      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      
    }
  }

  useEffect(() =>{
    if(token){
      navigate('/');
    }
  },[token, navigate])


  return (
    <div className='bg-white py-16 sm:py-24'>
      <div className='max-w-md mx-auto px-4 sm:px-6'>
        <form onSubmit={onSubmitHandler} className='bg-white border border-[#e5e5e5] p-8 sm:p-12'>
          <div className='mb-8'>
            <h1 className='text-2xl sm:text-3xl font-light uppercase tracking-wider text-[#111111] mb-2'>
              {currentState}
            </h1>
            <div className='w-12 h-[1px] bg-[#111111]'></div>
          </div>
          
          {currentState === 'Đăng ký' && (
            <input 
              onChange={(e) => setName(e.target.value)} 
              value={name} 
              type="text" 
              className='w-full px-0 py-3 border-b border-[#e5e5e5] bg-transparent text-sm font-light uppercase tracking-wide text-[#111111] placeholder:text-[#222222] placeholder:opacity-50 focus:outline-none focus:border-black transition-colors mb-4' 
              placeholder='Tên' 
              required 
            />
          )}
          
          <input 
            onChange={(e) => setEmail(e.target.value)} 
            value={email} 
            type="email" 
            className='w-full px-0 py-3 border-b border-[#e5e5e5] bg-transparent text-sm font-light uppercase tracking-wide text-[#111111] placeholder:text-[#222222] placeholder:opacity-50 focus:outline-none focus:border-black transition-colors mb-4' 
            placeholder='Email' 
            required 
          />
          
          <input 
            onChange={(e) => setPassword(e.target.value)} 
            value={password} 
            type="password" 
            className='w-full px-0 py-3 border-b border-[#e5e5e5] bg-transparent text-sm font-light uppercase tracking-wide text-[#111111] placeholder:text-[#222222] placeholder:opacity-50 focus:outline-none focus:border-black transition-colors mb-6' 
            placeholder='Mật khẩu' 
            required 
          />
          
          <div className='w-full flex justify-between text-xs mb-8'>
            <button type='button' className='text-[#222222] font-light hover:text-[#111111] transition-colors'>
              Quên mật khẩu?
            </button>
            {
              currentState === 'Đăng nhập' 
                ? <button type='button' onClick={() => setCurrentState('Đăng ký')} className='text-[#222222] font-light hover:text-[#111111] transition-colors'>
                    Tạo tài khoản
                  </button>
                : <button type='button' onClick={() => setCurrentState('Đăng nhập')} className='text-[#222222] font-light hover:text-[#111111] transition-colors'>
                    Đăng nhập tại đây
                  </button>
            }
          </div>
          
          <button 
            type='submit' 
            className='w-full bg-black text-white text-xs sm:text-sm font-light uppercase tracking-wider py-3 hover:opacity-80 transition-opacity'
          >
            {currentState === 'Đăng nhập' ? 'Đăng nhập' : 'Đăng ký'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login