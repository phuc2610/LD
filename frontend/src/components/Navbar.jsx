import React, { useContext, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const { setShowSearch: setGlobalShowSearch, getCartCount, navigate, token, setToken, setCartItems, user, setUser, search, setSearch } = useContext(ShopContext);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setCartItems({});
    setUser && setUser(null);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setGlobalShowSearch(true);
    setShowSearch(false);
    navigate("/collection");
  };

  return (
    <>
      {/* Main Navbar */}
      <nav 
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-md border-b border-[#e5e5e5] shadow-sm' 
            : 'bg-white border-b border-[#e5e5e5]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center group"
            >
              <img 
                src={assets.logo} 
                className="h-8 sm:h-10 lg:h-12 transition-transform duration-300 group-hover:scale-105" 
                alt="DL Clothing Logo" 
              />
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8 lg:gap-12">
              <NavLink 
                to="/" 
                className="relative text-[11px] sm:text-xs font-light tracking-wider uppercase text-[#111111] 
                  hover:text-[#111111] transition-colors duration-300
                  after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#111111] 
                  after:transition-all after:duration-300 hover:after:w-full"
              >
                TRANG CHỦ
              </NavLink>
              <NavLink 
                to="/collection" 
                className="relative text-[11px] sm:text-xs font-light tracking-wider uppercase text-[#111111] 
                  hover:text-[#111111] transition-colors duration-300
                  after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#111111] 
                  after:transition-all after:duration-300 hover:after:w-full"
              >
                SẢN PHẨM
              </NavLink>
              <NavLink 
                to="/about" 
                className="relative text-[11px] sm:text-xs font-light tracking-wider uppercase text-[#111111] 
                  hover:text-[#111111] transition-colors duration-300
                  after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#111111] 
                  after:transition-all after:duration-300 hover:after:w-full"
              >
                GIỚI THIỆU
              </NavLink>
              <NavLink 
                to="/contact" 
                className="relative text-[11px] sm:text-xs font-light tracking-wider uppercase text-[#111111] 
                  hover:text-[#111111] transition-colors duration-300
                  after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#111111] 
                  after:transition-all after:duration-300 hover:after:w-full"
              >
                LIÊN HỆ
              </NavLink>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
              {/* Search Button */}
              <button 
                onClick={() => setShowSearch(!showSearch)} 
                className="p-2 hover:opacity-60 transition-opacity duration-200"
                aria-label="Search"
              >
                <img src={assets.search_icon} className="w-4 h-4 sm:w-5 sm:h-5" alt="Search" />
              </button>

              {/* Profile Dropdown */}
              <div className="group relative">
                <div className="flex items-center gap-2 cursor-pointer p-2 hover:opacity-60 transition-opacity duration-200">
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
                  <div className="group-hover:block hidden absolute right-0 pt-2 z-10 animate-fadeIn">
                    <div className="bg-white border border-[#e5e5e5] py-2 w-48 shadow-lg rounded-sm">
                      <button 
                        onClick={() => navigate("/profile")} 
                        className="w-full text-left px-4 py-2.5 text-xs font-light uppercase tracking-wide text-[#111111] 
                          hover:bg-[#f9f9f9] transition-colors duration-200"
                      >
                        Hồ sơ của tôi
                      </button>
                      <button 
                        onClick={() => navigate("/orders")} 
                        className="w-full text-left px-4 py-2.5 text-xs font-light uppercase tracking-wide text-[#111111] 
                          hover:bg-[#f9f9f9] transition-colors duration-200"
                      >
                        Đơn hàng của tôi
                      </button>
                      <button 
                        onClick={() => navigate("/wishlist")} 
                        className="w-full text-left px-4 py-2.5 text-xs font-light uppercase tracking-wide text-[#111111] 
                          hover:bg-[#f9f9f9] transition-colors duration-200"
                      >
                        Sản phẩm yêu thích
                      </button>
                      <hr className="my-1 border-[#e5e5e5]" />
                      <button 
                        onClick={logout} 
                        className="w-full text-left px-4 py-2.5 text-xs font-light uppercase tracking-wide text-[#111111] 
                          hover:bg-[#f9f9f9] transition-colors duration-200"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Cart */}
              <Link 
                to="/cart" 
                className="relative p-2 hover:opacity-60 transition-opacity duration-200"
              >
                <img src={assets.cart_icon} className="w-4 h-4 sm:w-5 sm:h-5" alt="Cart" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 text-center leading-4 sm:leading-5 
                    text-[#111111] bg-[#F5C842] rounded-full text-[10px] sm:text-xs font-medium
                    animate-pulse">
                    {getCartCount()}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setVisible(true)} 
                className="md:hidden p-2 hover:opacity-60 transition-opacity duration-200"
                aria-label="Menu"
              >
                <img src={assets.menu_icon} className="w-5 h-5" alt="Menu" />
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar (Desktop) */}
        {showSearch && (
          <div className="border-t border-[#e5e5e5] bg-white animate-slideInUp">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-4">
                <div className="flex-1 max-w-2xl relative">
                  <input 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                    className="w-full px-0 py-2 border-0 border-b border-[#e5e5e5] bg-transparent 
                      text-sm font-light uppercase tracking-wide text-[#111111] 
                      placeholder:text-[#222222] placeholder:opacity-40
                      focus:outline-none focus:border-[#111111] transition-colors duration-300" 
                    type="text" 
                    placeholder="Tìm kiếm sản phẩm..." 
                    autoFocus
                  />
                </div>
                <button 
                  type="button"
                  onClick={() => setShowSearch(false)} 
                  className="p-2 hover:opacity-60 transition-opacity"
                  aria-label="Close search"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Drawer */}
      {visible && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998] md:hidden animate-fadeIn"
            onClick={() => setVisible(false)}
          />
          
          {/* Drawer */}
          <div className="fixed top-0 right-0 h-full bg-white border-l border-[#e5e5e5] z-[9999] w-80 md:hidden animate-slideInRight">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#e5e5e5]">
                <img src={assets.logo} className="h-8" alt="DL Clothing Logo" />
                <button 
                  onClick={() => setVisible(false)} 
                  className="p-2 hover:opacity-60 transition-opacity duration-200"
                  aria-label="Close menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 py-6 overflow-y-auto">
                <NavLink 
                  onClick={() => setVisible(false)} 
                  className="block px-6 py-4 text-xs font-light uppercase tracking-wider text-[#111111] 
                    hover:bg-[#f9f9f9] transition-colors duration-200 border-l-4 border-transparent
                    hover:border-[#111111]" 
                  to="/"
                >
                  TRANG CHỦ
                </NavLink>
                <NavLink 
                  onClick={() => setVisible(false)} 
                  className="block px-6 py-4 text-xs font-light uppercase tracking-wider text-[#111111] 
                    hover:bg-[#f9f9f9] transition-colors duration-200 border-l-4 border-transparent
                    hover:border-[#111111]" 
                  to="/collection"
                >
                  SẢN PHẨM
                </NavLink>
                <NavLink 
                  onClick={() => setVisible(false)} 
                  className="block px-6 py-4 text-xs font-light uppercase tracking-wider text-[#111111] 
                    hover:bg-[#f9f9f9] transition-colors duration-200 border-l-4 border-transparent
                    hover:border-[#111111]" 
                  to="/about"
                >
                  GIỚI THIỆU
                </NavLink>
                <NavLink 
                  onClick={() => setVisible(false)} 
                  className="block px-6 py-4 text-xs font-light uppercase tracking-wider text-[#111111] 
                    hover:bg-[#f9f9f9] transition-colors duration-200 border-l-4 border-transparent
                    hover:border-[#111111]" 
                  to="/contact"
                >
                  LIÊN HỆ
                </NavLink>
                <button
                  onClick={() => {
                    setVisible(false);
                    if (token) {
                      navigate("/wishlist");
                    } else {
                      toast.error("Vui lòng đăng nhập để xem sản phẩm yêu thích");
                      navigate("/login");
                    }
                  }}
                  className="w-full text-left px-6 py-4 text-xs font-light uppercase tracking-wider text-[#111111] 
                    hover:bg-[#f9f9f9] transition-colors duration-200 border-l-4 border-transparent
                    hover:border-[#111111] flex items-center gap-3"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                  YÊU THÍCH
                </button>
              </nav>

              {/* User Info */}
              {user && token && (
                <div className="border-t border-[#e5e5e5] p-6 bg-[#f9f9f9]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#111111] rounded-full flex items-center justify-center">
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
                    className="w-full bg-[#111111] text-white py-3 px-4 text-xs font-light uppercase tracking-wider 
                      hover:bg-[#222222] transition-colors duration-300"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
