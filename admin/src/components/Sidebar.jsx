import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

const Sidebar = () => {
  return (
    <div className="w-[18%] min-h-screen border-r-2 border-r-gray-300">
      <div className="flex flex-col gap-4 pt-6 pl-[20%] text-[15px]">
        <NavLink className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l" to="/">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold">
             <img src={assets.dashboard_icon} alt="" />
          </div>
          <p className="hidden md:block">Dashboard</p>
        </NavLink>

        <NavLink className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l" to="/add">
          <img className="w-6 h-6 icon" src={assets.add_icon} alt="" />
          <p className="hidden md:block">Thêm sản phẩm</p>
        </NavLink>

        <NavLink className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l" to="/list">
          <img className="w-6 h-6 icon" src={assets.order_icon} alt="" />
          <p className="hidden md:block">Danh sách sản phẩm</p>
        </NavLink>

        <NavLink className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l" to="/orders">
          <img className="w-6 h-6 " src={assets.list_order_icon} alt="" />
          <p className="hidden md:block">Danh sách đơn hàng</p>
        </NavLink>

        <NavLink className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l" to="/users">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold">
            <img src={assets.user_icon} alt="" />
          </div>
          <p className="hidden md:block">Quản lý tài khoản khách hàng</p>
        </NavLink>

        <NavLink
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
          to="/statistics"
        >
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold">
            <img src={assets.thongke_icon} alt="" />
          </div>
          <p className="hidden md:block">Thống kê & Báo cáo</p>
        </NavLink>

        <NavLink
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
          to="/chat"
        >
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="hidden md:block">Chat với khách hàng</p>
        </NavLink>

        <NavLink
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
          to="/reviews"
        >
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <p className="hidden md:block">Quản lý đánh giá</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
