import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'

const QuickAddModal = ({ isOpen, onClose, product }) => {
    const { addToCart } = useContext(ShopContext);
    const [selectedSize, setSelectedSize] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = async () => {
        if (!selectedSize) {
            return;
        }
        
        setIsAdding(true);
        try {
            await addToCart(product._id, selectedSize);
            onClose();
            setSelectedSize('');
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
        setIsAdding(false);
    };

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4'>
            <div className='bg-white border border-[#e5e5e5] p-6 sm:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto'>
                {/* Header */}
                <div className='flex justify-between items-start mb-6'>
                    <h3 className='text-sm sm:text-base font-light uppercase tracking-wider text-[#111111]'>Chọn size sản phẩm</h3>
                    <button 
                        onClick={onClose}
                        className='p-1 hover:opacity-60 transition-opacity'
                        aria-label="Close"
                    >
                        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M6 18L18 6M6 6l12 12' />
                        </svg>
                    </button>
                </div>

                {/* Product Info */}
                <div className='flex gap-4 mb-8 border-b border-[#e5e5e5] pb-6'>
                    <img 
                        src={product?.image?.[0]} 
                        alt={product?.name}
                        className='w-20 h-20 sm:w-24 sm:h-24 object-cover border border-[#e5e5e5]'
                    />
                    <div className='flex-1'>
                        <h4 className='text-sm font-light uppercase tracking-wide text-[#111111] mb-2'>{product?.name}</h4>
                        <p className='text-base sm:text-lg font-light text-[#F5C842]'>
                            {product?.price?.toLocaleString('vi-VN')} đ
                        </p>
                    </div>
                </div>

                {/* Size Selection */}
                <div className='mb-8'>
                    <p className='text-xs font-light uppercase tracking-wide text-[#111111] mb-4'>Chọn size:</p>
                    <div className='grid grid-cols-3 gap-2'>
                        {product?.sizes?.map((size) => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`py-2 px-4 text-xs font-light uppercase tracking-wide transition-all ${
                                    selectedSize === size
                                        ? 'border-2 border-black bg-black text-white'
                                        : 'border border-[#e5e5e5] bg-white text-[#111111] hover:border-black'
                                }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                    {!product?.sizes || product.sizes.length === 0 ? (
                        <p className='text-xs text-[#222222] font-light mt-2'>Không có size khả dụng</p>
                    ) : null}
                </div>

                {/* Action Buttons */}
                <div className='flex gap-3'>
                    <button
                        onClick={onClose}
                        className='flex-1 py-3 px-4 border border-[#e5e5e5] text-[#111111] text-xs font-light uppercase tracking-wider hover:border-black transition-colors'
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleAddToCart}
                        disabled={!selectedSize || isAdding}
                        className='flex-1 py-3 px-4 bg-black text-white text-xs font-light uppercase tracking-wider hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                    >
                        {isAdding ? (
                            <>
                                <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                Đang thêm...
                            </>
                        ) : (
                            'Thêm vào giỏ hàng'
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default QuickAddModal
