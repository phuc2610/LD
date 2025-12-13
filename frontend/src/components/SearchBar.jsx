import React, { useState, useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import { useLocation } from 'react-router-dom';
const SearchBar = () => {

    const {search, setSearch, showSearch, setShowSearch} = useContext(ShopContext);
    const [visible,setVisible] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if(location.pathname.includes('collection')){
            setVisible(true);
        }
        else{
            setVisible(false);
        }
    },[location])


  return showSearch && visible  ? (
    <div className='border-b border-[#e5e5e5] bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
            <div className='flex items-center justify-center gap-4'>
                <div className='flex-1 max-w-2xl flex items-center border-b border-[#111111] pb-2'>
                    <input 
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)} 
                        className='flex-1 outline-none bg-transparent text-sm font-light uppercase tracking-wide text-[#111111] placeholder:text-[#222222] placeholder:opacity-50' 
                        type="text" 
                        placeholder='Search' 
                    />
                    <img className='w-4 h-4 opacity-60' src={assets.search_icon} alt="" />
                </div>
                <button 
                    onClick={() => setShowSearch(false)} 
                    className='p-2 hover:opacity-60 transition-opacity'
                    aria-label="Close search"
                >
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M6 18L18 6M6 6l12 12' />
                    </svg>
                </button>
            </div>
        </div>
    </div>
  ) : null
}

export default SearchBar