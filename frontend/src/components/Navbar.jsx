import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems, user, setUser } = useContext(ShopContext);

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setCartItems({});
    setUser && setUser(null);
  };

  return (
    <div className="sticky top-0 z-50 bg-white border-b border-[#e5e5e5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={assets.logo} className="h-8 sm:h-10 hover:opacity-80 transition-opacity" alt="TLook Logo" />
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <NavLink 
              to="/" 
              className="text-[11px] sm:text-xs font-light tracking-wider uppercase text-[#111111] hover:text-black transition-colors"
            >
              TRANG CHỦ
            </NavLink>
            <NavLink 
              to="/collection" 
              className="text-[11px] sm:text-xs font-light tracking-wider uppercase text-[#111111] hover:text-black transition-colors"
            >
              SẢN PHẨM
            </NavLink>
            <NavLink 
              to="/about" 
              className="text-[11px] sm:text-xs font-light tracking-wider uppercase text-[#111111] hover:text-black transition-colors"
            >
              GIỚI THIỆU
            </NavLink>
            <NavLink 
              to="/contact" 
              className="text-[11px] sm:text-xs font-light tracking-wider uppercase text-[#111111] hover:text-black transition-colors"
            >
              LIÊN HỆ
            </NavLink>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search Button */}
            <button 
              onClick={() => setShowSearch(true)} 
              className="p-2 hover:opacity-60 transition-opacity"
              aria-label="Search"
            >
              <img src={assets.search_icon} className="w-4 h-4 sm:w-5 sm:h-5" alt="Search" />
            </button>

            {/* Profile Dropdown */}
            <div className="group relative">
              <div className="flex items-center gap-2 cursor-pointer p-2 hover:opacity-60 transition-opacity">
                <img
                  onClick={() => (token ? null : navigate("/login"))}
                  src={assets.profile_icon}
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  alt="Profile"
                />
                {user && token && (
                  <span className="hidden sm:block text-xs font-light uppercase tracking-wide text-[#111111]">
                    {user.name}
                  </span>
                )}
              </div>
              
              {/* Dropdown Menu */}
              {token && (
                <div className="group-hover:block hidden absolute right-0 pt-2 z-10">
                  <div className="bg-white border border-[#e5e5e5] py-2 w-48 shadow-sm">
                    <button 
                      onClick={() => navigate("/profile")} 
                      className="w-full text-left px-4 py-2 text-xs font-light uppercase tracking-wide text-[#111111] hover:bg-[#f9f9f9] transition-colors"
                    >
                      Hồ sơ của tôi
                    </button>
                    <button 
                      onClick={() => navigate("/orders")} 
                      className="w-full text-left px-4 py-2 text-xs font-light uppercase tracking-wide text-[#111111] hover:bg-[#f9f9f9] transition-colors"
                    >
                      Đơn hàng của tôi
                    </button>
                    <hr className="my-1 border-[#e5e5e5]" />
                    <button 
                      onClick={logout} 
                      className="w-full text-left px-4 py-2 text-xs font-light uppercase tracking-wide text-[#111111] hover:bg-[#f9f9f9] transition-colors"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 hover:opacity-60 transition-opacity">
              <img src={assets.cart_icon} className="w-4 h-4 sm:w-5 sm:h-5" alt="Cart" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 text-center leading-4 sm:leading-5 text-black bg-[#F5C842] rounded-full text-[10px] sm:text-xs font-medium">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setVisible(true)} 
              className="md:hidden p-2 hover:opacity-60 transition-opacity"
              aria-label="Menu"
            >
              <img src={assets.menu_icon} className="w-5 h-5" alt="Menu" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {visible && (
        <div className="fixed top-0 right-0 h-full bg-white border-l border-[#e5e5e5] z-[9999] w-80 md:hidden">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#e5e5e5]">
              <img src={assets.logo} className="h-8" alt="TLook Logo" />
              <button 
                onClick={() => setVisible(false)} 
                className="p-2 hover:opacity-60 transition-opacity"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 py-6">
              <NavLink 
                onClick={() => setVisible(false)} 
                className="block px-6 py-4 text-xs font-light uppercase tracking-wider text-[#111111] hover:bg-[#f9f9f9] transition-colors" 
                to="/"
              >
                TRANG CHỦ
              </NavLink>
              <NavLink 
                onClick={() => setVisible(false)} 
                className="block px-6 py-4 text-xs font-light uppercase tracking-wider text-[#111111] hover:bg-[#f9f9f9] transition-colors" 
                to="/collection"
              >
                SẢN PHẨM
              </NavLink>
              <NavLink 
                onClick={() => setVisible(false)} 
                className="block px-6 py-4 text-xs font-light uppercase tracking-wider text-[#111111] hover:bg-[#f9f9f9] transition-colors" 
                to="/about"
              >
                GIỚI THIỆU
              </NavLink>
              <NavLink 
                onClick={() => setVisible(false)} 
                className="block px-6 py-4 text-xs font-light uppercase tracking-wider text-[#111111] hover:bg-[#f9f9f9] transition-colors" 
                to="/contact"
              >
                LIÊN HỆ
              </NavLink>
            </nav>

            {/* User Info */}
            {user && token && (
              <div className="border-t border-[#e5e5e5] p-6 bg-[#f9f9f9]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                    <span className="text-white font-light text-sm uppercase">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-light text-sm text-[#111111] uppercase tracking-wide">{user.name}</p>
                    <p className="text-xs text-[#222222]">{user.email}</p>
                  </div>
                </div>
                <button 
                  onClick={logout} 
                  className="w-full bg-black text-white py-3 px-4 text-xs font-light uppercase tracking-wider hover:opacity-80 transition-opacity"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {visible && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-40 z-[9998] md:hidden" 
          onClick={() => setVisible(false)}
        ></div>
      )}
    </div>
  );
};

export default Navbar;
