import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } =
    useContext(ShopContext);

  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item],
            });
          }
        }
      }
      setCartData(tempData);
    } else {
      setCartData([]);
    }
  }, [cartItems, products]);

  return (
    <div className="bg-white pt-12 sm:pt-16 pb-16 sm:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 sm:mb-16">
          <Title text1={"Giỏ hàng"} text2={"của bạn"} />
        </div>

        {cartData.length === 0 ? (
          <div className="text-center py-16 sm:py-24">
            <svg className="w-16 h-16 mx-auto text-[#e5e5e5] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="text-sm sm:text-base text-[#222222] font-light mb-4">Giỏ hàng của bạn đang trống</p>
            <button
              onClick={() => navigate("/collection")}
              className="inline-block bg-[#111111] text-white px-6 py-3 text-xs sm:text-sm font-light uppercase tracking-wider hover:bg-[#222222] transition-colors duration-300"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-0 border-t border-[#e5e5e5] mb-12">
              {cartData.map((item, index) => {
                const productData = products.find(
                  (product) => product._id === item._id
                );

                return (
                  <div
                    key={index}
                    className="py-6 sm:py-8 border-b border-[#e5e5e5] flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 hover:bg-[#fafafa] transition-colors duration-300"
                  >
                    <div className="flex items-start gap-4 sm:gap-6 flex-1 w-full">
                      <img
                        className="w-24 sm:w-28 h-24 sm:h-28 object-cover border border-[#e5e5e5] flex-shrink-0"
                        src={productData?.image[0]}
                        alt={productData?.name}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base font-light uppercase tracking-wide text-[#111111] mb-3 line-clamp-2">
                          {productData?.name}
                        </p>
                        <div className="flex items-center gap-4 flex-wrap">
                          <p className="text-base sm:text-lg font-light text-[#F5C842]">
                            {productData?.price.toLocaleString("vi-VN")}
                            {currency}
                          </p>
                          <span className="text-xs font-light uppercase tracking-wide text-[#222222] border border-[#e5e5e5] px-3 py-1.5 bg-white">
                            Size: {item.size}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="flex items-center gap-2 border border-[#e5e5e5]">
                        <button
                          onClick={() => updateQuantity(item._id, item.size, Math.max(1, item.quantity - 1))}
                          className="w-8 h-8 flex items-center justify-center hover:bg-[#f9f9f9] transition-colors text-[#111111]"
                          aria-label="Decrease quantity"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 12H4" />
                          </svg>
                        </button>
                        <input
                          value={item.quantity}
                          onChange={(e) => {
                            const next = Number(e.target.value);
                            if (Number.isNaN(next)) return;
                            updateQuantity(item._id, item.size, Math.max(1, next));
                          }}
                          onBlur={(e) => {
                            const next = Number(e.target.value);
                            if (!next || Number.isNaN(next)) {
                              updateQuantity(item._id, item.size, 1);
                            }
                          }}
                          className="w-12 px-2 py-2 text-sm font-light text-center focus:outline-none border-0 bg-transparent"
                          type="number"
                          min={1}
                        />
                        <button
                          onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-[#f9f9f9] transition-colors text-[#111111]"
                          aria-label="Increase quantity"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                      <button
                        onClick={() => updateQuantity(item._id, item.size, 0)}
                        className="p-2 hover:bg-[#f9f9f9] transition-colors rounded-full"
                        aria-label="Remove item"
                      >
                        <svg className="w-5 h-5 text-[#222222]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end">
              <div className="w-full sm:w-[420px]">
                <CartTotal />
                <div className="mt-8">
                  <button
                    onClick={() => navigate("/place-order")}
                    className="w-full bg-[#111111] text-white text-xs sm:text-sm font-light uppercase tracking-wider py-4 hover:bg-[#222222] hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300"
                  >
                    Thanh toán
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
