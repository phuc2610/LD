import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
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
    <div className="bg-white pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Title text1={"Giỏ hàng"} text2={"của bạn"} />
        </div>

        <div className="space-y-0 border-t border-[#e5e5e5]">
          {cartData.map((item, index) => {
            const productData = products.find(
              (product) => product._id === item._id
            );

            return (
              <div
                key={index}
                className="py-6 border-b border-[#e5e5e5] flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
              >
                <div className="flex items-start gap-4 flex-1">
                  <img
                    className="w-20 sm:w-24 h-20 sm:h-24 object-cover border border-[#e5e5e5]"
                    src={productData?.image[0]}
                    alt={productData?.name}
                  />
                  <div className="flex-1">
                    <p className="text-sm sm:text-base font-light uppercase tracking-wide text-[#111111] mb-2">
                      {productData?.name}
                    </p>
                    <div className="flex items-center gap-4 flex-wrap">
                      <p className="text-sm font-light text-[#F5C842]">
                        {productData?.price.toLocaleString("vi-VN")}
                        {currency}
                      </p>
                      <span className="text-xs font-light uppercase tracking-wide text-[#222222] border border-[#e5e5e5] px-2 py-1">
                        Size: {item.size}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <input
                    onChange={(e) =>
                      e.target.value === "" || e.target.value === "0"
                        ? null
                        : updateQuantity(
                            item._id,
                            item.size,
                            Number(e.target.value)
                          )
                    }
                    className="border border-[#e5e5e5] w-16 px-2 py-2 text-sm font-light text-center focus:outline-none focus:border-black transition-colors"
                    type="number"
                    min={1}
                    defaultValue={item.quantity}
                  />
                  <button
                    onClick={() => updateQuantity(item._id, item.size, 0)}
                    className="p-2 hover:opacity-60 transition-opacity"
                    aria-label="Remove item"
                  >
                    <img
                      className="w-4 h-4"
                      src={assets.bin_icon}
                      alt="Delete"
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {cartData.length > 0 && (
          <div className="flex justify-end mt-12">
            <div className="w-full sm:w-[400px]">
              <CartTotal />
              <div className="mt-6">
                <button
                  onClick={() => navigate("/place-order")}
                  className="w-full bg-black text-white text-xs sm:text-sm font-light uppercase tracking-wider py-3 hover:opacity-80 transition-opacity"
                >
                  Thanh toán
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
