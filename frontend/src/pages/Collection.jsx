import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import ProductItem from '../components/ProductItem';

const TYPE_OPTIONS = [
  "JEWELRY","MINI POUCH","FLANNEL","PHONE CASES","BOWLER BAGS","JERSEY","BEANIES","POLOS",
  "SHIRTS","TANK TOP","UNDERWEAR","INNERWEAR","SLIDES","SOCKS","CROSSBODY BAGS","CAPS","JEANS",
  "JACKETS","SWEATSHIRTS","PANTS","TOTE BAGS","CARDIGANS","SHORTS","VEST","ACCESSORIES",
  "SHOULDER BAGS","HOODIES","LONGSLEEVES","T-SHIRTS","BACKPACKS"
];

const SIZE_OPTIONS = ["S","M","L","XL"];

const COLOR_OPTIONS = ["Red","Orange","Yellow","Green","Blue","Purple","Pink","Brown","White","Grey","Black","Multi-Colour"];

const PRICE_OPTIONS = [
  {value:'under-100', label:'Giá dưới 100.000đ', min:0, max:100000},
  {value:'100-200', label:'100.000đ – 200.000đ', min:100000, max:200000},
  {value:'200-300', label:'200.000đ – 300.000đ', min:200000, max:300000},
  {value:'300-500', label:'300.000đ – 500.000đ', min:300000, max:500000},
  {value:'over-500', label:'Giá trên 500.000đ', min:500000, max:Infinity},
];

const Collection = () => {

  const {products , search , showSearch } = useContext(ShopContext);
  const [filterProducts, setFilterProducts] = useState([]);
  const [brands,setBrands] = useState([]);
  const [styles,setStyles] = useState([]);
  const [types,setTypes] = useState([]);
  const [sizes,setSizes] = useState([]);
  const [colors,setColors] = useState([]);
  const [priceRange, setPriceRange] = useState('');
  const [sortType, setSortType] = useState('relavent');
  const [openFilter, setOpenFilter] = useState(null); // 'price', 'type', 'size', 'color', 'style', 'brand'

  const toggleArrayValue = (value, setter, state) => {
    if(state.includes(value)){
      setter(state.filter(item => item !== value));
    } else {
      setter([...state, value]);
    }
  };


  useEffect(() => {
    let productsCopy = products.slice();

    if(showSearch && search.length ){
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    }

    if(brands.length > 0){
      productsCopy = productsCopy.filter(item => brands.includes(item.category));
    }
    if(styles.length > 0){
      productsCopy = productsCopy.filter(item => styles.includes(item.subCategory));
    }
    if(types.length > 0){
      productsCopy = productsCopy.filter(item => types.includes(item.type));
    }
    if(sizes.length > 0){
      productsCopy = productsCopy.filter(item => Array.isArray(item.sizes) && item.sizes.some(size => sizes.includes(size)));
    }
    if(colors.length > 0){
      productsCopy = productsCopy.filter(item => Array.isArray(item.colors) && item.colors.some(color => colors.includes(color)));
    }

    if(priceRange){
      const range = PRICE_OPTIONS.find((r) => r.value === priceRange);
      if(range){
        productsCopy = productsCopy.filter(item => item.price >= range.min && item.price <= range.max);
      }
    }

    switch (sortType) {
      case 'low-high':
        productsCopy.sort((a,b)=>(a.price - b.price));
        break;
      case 'high-low':
        productsCopy.sort((a,b)=>(b.price - a.price));
        break;
      default:
        break;
    }

    setFilterProducts(productsCopy);
  },[brands, styles , types, sizes, colors, priceRange, search , showSearch , products, sortType]);

  return (
    <div className='bg-white'>
      {/* Page Header */}
      <div className='py-12 sm:py-16 lg:py-20 bg-white border-b border-[#e5e5e5]'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h1 className='text-2xl sm:text-3xl lg:text-4xl font-light uppercase tracking-wider text-[#111111] mb-2'>
            Tất cả sản phẩm
          </h1>
          <p className='text-sm font-light text-[#222222]'>
            {filterProducts.length} kết quả
          </p>
        </div>
      </div>
      
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>

        {/* Active Filters */}
        {(brands.length > 0 || styles.length > 0 || types.length > 0 || sizes.length > 0 || colors.length > 0 || priceRange) && (
          <div className='flex flex-wrap items-center gap-2 mb-6'>
            {priceRange && (
              <button 
                onClick={() => setPriceRange('')}
                className='flex items-center gap-2 px-3 py-1.5 border border-[#e5e5e5] text-xs font-light uppercase tracking-wide text-[#111111] hover:border-[#111111] transition-colors duration-300'
              >
                {PRICE_OPTIONS.find(r => r.value === priceRange)?.label}
                <span>×</span>
              </button>
            )}
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() => toggleArrayValue(brand, setBrands, brands)}
                className='flex items-center gap-2 px-3 py-1.5 border border-[#e5e5e5] text-xs font-light uppercase tracking-wide text-[#111111] hover:border-[#111111] transition-colors duration-300'
              >
                {brand}
                <span>×</span>
              </button>
            ))}
            {types.map((type) => (
              <button
                key={type}
                onClick={() => toggleArrayValue(type, setTypes, types)}
                className='flex items-center gap-2 px-3 py-1.5 border border-[#e5e5e5] text-xs font-light uppercase tracking-wide text-[#111111] hover:border-[#111111] transition-colors duration-300'
              >
                {type}
                <span>×</span>
              </button>
            ))}
            {styles.map((style) => (
              <button
                key={style}
                onClick={() => toggleArrayValue(style, setStyles, styles)}
                className='flex items-center gap-2 px-3 py-1.5 border border-[#e5e5e5] text-xs font-light uppercase tracking-wide text-[#111111] hover:border-[#111111] transition-colors duration-300'
              >
                {style}
                <span>×</span>
              </button>
            ))}
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => toggleArrayValue(size, setSizes, sizes)}
                className='flex items-center gap-2 px-3 py-1.5 border border-[#e5e5e5] text-xs font-light uppercase tracking-wide text-[#111111] hover:border-[#111111] transition-colors duration-300'
              >
                Size: {size}
                <span>×</span>
              </button>
            ))}
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => toggleArrayValue(color, setColors, colors)}
                className='flex items-center gap-2 px-3 py-1.5 border border-[#e5e5e5] text-xs font-light uppercase tracking-wide text-[#111111] hover:border-[#111111] transition-colors duration-300'
              >
                {color}
                <span>×</span>
              </button>
            ))}
            {(brands.length > 0 || styles.length > 0 || types.length > 0 || sizes.length > 0 || colors.length > 0 || priceRange) && (
              <button 
                onClick={() => {
                  setBrands([]);
                  setStyles([]);
                  setTypes([]);
                  setSizes([]);
                  setColors([]);
                  setPriceRange('');
                }}
                className='text-xs font-light uppercase tracking-wide text-[#222222] hover:text-[#111111] transition-colors duration-300'
              >
                Xóa tất cả
              </button>
            )}
          </div>
        )}

        {/* Filter Bar - Horizontal Layout */}
        <div className='border-b border-[#e5e5e5] pb-4 mb-8'>
          <div className='flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm'>
            {/* Filter Prices */}
            <div 
              className='relative'
              onMouseEnter={() => setOpenFilter('price')}
              onMouseLeave={() => setOpenFilter(null)}
            >
              <button className='flex items-center gap-2 text-[#111111] font-light uppercase tracking-wide hover:text-black transition-colors'>
                Price
                <svg className={`w-3 h-3 transition-transform duration-300 ${openFilter === 'price' ? 'rotate-180' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M19 9l-7 7-7-7' />
                </svg>
              </button>
              {openFilter === 'price' && (
                <>
                  {/* Bridge to prevent dropdown from closing when moving mouse */}
                  <div className='absolute top-full left-0 w-full h-2' />
                  <div className='absolute top-full left-0 mt-2 bg-white border border-[#e5e5e5] shadow-sm z-10 min-w-[180px] animate-fadeIn'>
                    <div className='p-3 space-y-2'>
                    {PRICE_OPTIONS.map((option) => (
                      <label key={option.value} className='flex items-center gap-2 text-xs font-light uppercase tracking-wide cursor-pointer hover:text-black'>
                        <input
                          className='w-3 h-3'
                          type="radio"
                          name="price"
                          checked={priceRange === option.value}
                          onChange={() => setPriceRange(option.value)}
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                    <button onClick={() => setPriceRange('')} type="button" className='text-[11px] text-gray-500 underline'>Reset</button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Type Filter */}
            <div 
              className='relative'
              onMouseEnter={() => setOpenFilter('type')}
              onMouseLeave={() => setOpenFilter(null)}
            >
              <button className='flex items-center gap-2 text-[#111111] font-light uppercase tracking-wide hover:text-black transition-colors'>
                Type
                <svg className={`w-3 h-3 transition-transform duration-300 ${openFilter === 'type' ? 'rotate-180' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M19 9l-7 7-7-7' />
                </svg>
              </button>
              {openFilter === 'type' && (
                <>
                  {/* Bridge to prevent dropdown from closing when moving mouse */}
                  <div className='absolute top-full left-0 w-full h-2' />
                  <div className='absolute top-full left-0 mt-2 bg-white border border-[#e5e5e5] shadow-sm z-10 max-h-72 overflow-y-auto min-w-[200px] animate-fadeIn'>
                    <div className='p-3 space-y-2'>
                    {TYPE_OPTIONS.map((option)=>(
                      <label key={option} className='flex items-center gap-2 text-xs font-light uppercase tracking-wide cursor-pointer hover:text-black'>
                        <input className='w-3 h-3' type="checkbox" checked={types.includes(option)} onChange={() => toggleArrayValue(option, setTypes, types)} />
                        <span>{option}</span>
                      </label>
                    ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Size Filter */}
            <div 
              className='relative'
              onMouseEnter={() => setOpenFilter('size')}
              onMouseLeave={() => setOpenFilter(null)}
            >
              <button className='flex items-center gap-2 text-[#111111] font-light uppercase tracking-wide hover:text-black transition-colors'>
                Size
                <svg className={`w-3 h-3 transition-transform duration-300 ${openFilter === 'size' ? 'rotate-180' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M19 9l-7 7-7-7' />
                </svg>
              </button>
              {openFilter === 'size' && (
                <>
                  {/* Bridge to prevent dropdown from closing when moving mouse */}
                  <div className='absolute top-full left-0 w-full h-2' />
                  <div className='absolute top-full left-0 mt-2 bg-white border border-[#e5e5e5] shadow-sm z-10 min-w-[140px] animate-fadeIn'>
                    <div className='p-3 space-y-2'>
                    {SIZE_OPTIONS.map((option)=>(
                      <label key={option} className='flex items-center gap-2 text-xs font-light uppercase tracking-wide cursor-pointer hover:text-black'>
                        <input className='w-3 h-3' type="checkbox" checked={sizes.includes(option)} onChange={() => toggleArrayValue(option, setSizes, sizes)} />
                        <span>{option}</span>
                      </label>
                    ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Color Filter */}
            <div 
              className='relative'
              onMouseEnter={() => setOpenFilter('color')}
              onMouseLeave={() => setOpenFilter(null)}
            >
              <button className='flex items-center gap-2 text-[#111111] font-light uppercase tracking-wide hover:text-black transition-colors'>
                Color
                <svg className={`w-3 h-3 transition-transform duration-300 ${openFilter === 'color' ? 'rotate-180' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M19 9l-7 7-7-7' />
                </svg>
              </button>
              {openFilter === 'color' && (
                <>
                  {/* Bridge to prevent dropdown from closing when moving mouse */}
                  <div className='absolute top-full left-0 w-full h-2' />
                  <div className='absolute top-full left-0 mt-2 bg-white border border-[#e5e5e5] shadow-sm z-10 min-w-[200px] max-h-72 overflow-y-auto animate-fadeIn'>
                    <div className='p-3 space-y-2'>
                    {COLOR_OPTIONS.map((option)=>(
                      <label key={option} className='flex items-center gap-2 text-xs font-light uppercase tracking-wide cursor-pointer hover:text-black'>
                        <input className='w-3 h-3' type="checkbox" checked={colors.includes(option)} onChange={() => toggleArrayValue(option, setColors, colors)} />
                        <span>{option}</span>
                      </label>
                    ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Style Filter (SubCategory) */}
            <div 
              className='relative'
              onMouseEnter={() => setOpenFilter('style')}
              onMouseLeave={() => setOpenFilter(null)}
            >
              <button className='flex items-center gap-2 text-[#111111] font-light uppercase tracking-wide hover:text-black transition-colors'>
                Style
                <svg className={`w-3 h-3 transition-transform duration-300 ${openFilter === 'style' ? 'rotate-180' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M19 9l-7 7-7-7' />
                </svg>
              </button>
              {openFilter === 'style' && (
                <>
                  {/* Bridge to prevent dropdown from closing when moving mouse */}
                  <div className='absolute top-full left-0 w-full h-2' />
                  <div className='absolute top-full left-0 mt-2 bg-white border border-[#e5e5e5] shadow-sm z-10 min-w-[180px] animate-fadeIn'>
                    <div className='p-3 space-y-2'>
                      {["Streetwear","Athleisure","Casual","Minimal"].map((style)=>(
                        <label key={style} className='flex items-center gap-2 text-xs font-light uppercase tracking-wide cursor-pointer hover:text-black'>
                          <input className='w-3 h-3' type="checkbox" checked={styles.includes(style)} onChange={() => toggleArrayValue(style, setStyles, styles)} />
                          <span>{style}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Brand Filter */}
            <div 
              className='relative'
              onMouseEnter={() => setOpenFilter('brand')}
              onMouseLeave={() => setOpenFilter(null)}
            >
              <button className='flex items-center gap-2 text-[#111111] font-light uppercase tracking-wide hover:text-black transition-colors'>
                Brand
                <svg className={`w-3 h-3 transition-transform duration-300 ${openFilter === 'brand' ? 'rotate-180' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M19 9l-7 7-7-7' />
                </svg>
              </button>
              {openFilter === 'brand' && (
                <>
                  {/* Bridge to prevent dropdown from closing when moving mouse */}
                  <div className='absolute top-full left-0 w-full h-2' />
                  <div className='absolute top-full left-0 mt-2 bg-white border border-[#e5e5e5] shadow-sm z-10 min-w-[180px] animate-fadeIn'>
                    <div className='p-3 space-y-2'>
                      {["Local Brand","International","Vintage","Collaboration"].map((brand)=>(
                        <label key={brand} className='flex items-center gap-2 text-xs font-light uppercase tracking-wide cursor-pointer hover:text-black'>
                          <input className='w-3 h-3' type="checkbox" checked={brands.includes(brand)} onChange={() => toggleArrayValue(brand, setBrands, brands)} />
                          <span>{brand}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Spacer */}
            <div className='flex-1'></div>

            {/* Order/Sort */}
            <div className='relative'>
              <select 
                onChange={(e)=>setSortType(e.target.value)} 
                className='appearance-none bg-transparent border-none text-xs sm:text-sm text-[#111111] font-light uppercase tracking-wide cursor-pointer focus:outline-none pr-6'
              >
                <option value="relavent">Order: Relevant</option>
                <option value="low-high">Order: Low to High</option>
                <option value="high-low">Order: High to Low</option>
              </select>
              <svg className='absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M19 9l-7 7-7-7' />
              </svg>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6'>
          {
            filterProducts.map((item,index)=>(
              <ProductItem key = {index} name={item.name} id={item._id} image={item.image} price={item.price}/>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Collection