import React, { useContext, useEffect, useState, useCallback } from "react";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";

const Profile = () => {
  const { token, backendUrl , setUser } = useContext(ShopContext);

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone_number: "",
    gender: "",
    address: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const getUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(backendUrl + "/api/user/profile", {
        headers: { token },
      });

      if (response.data.success) {
        setUserData({
          name: response.data.user.name || "",
          email: response.data.user.email || "",
          phone_number: response.data.user.phone_number || "",
          gender: response.data.user.gender || "",
          address: response.data.user.address || "",
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra khi tải thông tin");
    } finally {
      setLoading(false);
    }
  }, [backendUrl, token]);

  // Lấy thông tin user khi component mount
  useEffect(() => {
    if (token) {
      getUserProfile();
    }
  }, [token, getUserProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateProfile = async () => {

    if (!userData.name.trim()) {
      toast.error("Vui lòng nhập họ tên");
      return;
    }

    if (!userData.email.trim()) {
      toast.error("Vui lòng nhập email");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(backendUrl + "/api/user/profile", userData, {
        headers: { token },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setUser(
            response.data.user
        );
        setIsEditing(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra khi cập nhật thông tin");
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async () => {
    // Validation
    if (!passwordData.currentPassword.trim()) {
      toast.error("Vui lòng nhập mật khẩu hiện tại");
      return;
    }

    if (!passwordData.newPassword.trim()) {
      toast.error("Vui lòng nhập mật khẩu mới");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("Mật khẩu mới phải có ít nhất 8 ký tự");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(
        backendUrl + "/api/user/profile",
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: { token },
        }
      );

      if (response.data.success) {
        toast.success("Đổi mật khẩu thành công");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setShowPasswordForm(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra khi đổi mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  // Tạo avatar từ chữ cái đầu của tên
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#e5e5e5] border-t-black mx-auto"></div>
          <p className="mt-4 text-sm font-light text-[#222222]">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-8 sm:py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#e5e5e5] p-6 sm:p-12">
          {/* Header với avatar */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 pb-8 border-b border-[#e5e5e5]">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-white font-light text-lg uppercase">
                {userData.name ? getInitials(userData.name) : "U"}
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-light uppercase tracking-wider text-[#111111]">Hồ sơ của tôi</h2>
                <p className="text-sm text-[#222222] font-light">{userData.email}</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-6 py-2 text-xs font-light uppercase tracking-wider transition-opacity w-full sm:w-auto ${
                isEditing ? "bg-[#222222] hover:opacity-80 text-white" : "bg-black hover:opacity-80 text-white"
              }`}
            >
              {isEditing ? "Hủy" : "Chỉnh sửa"}
            </button>
          </div>

          <div className="flex flex-col gap-6">
            {/* Thông tin cá nhân */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-light uppercase tracking-wide text-[#111111] mb-2">Họ và tên *</label>
                <input
                  type="text"
                  name="name"
                  value={userData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Nhập họ và tên"
                  className="w-full px-0 py-3 border-b border-[#e5e5e5] bg-transparent text-sm font-light uppercase tracking-wide text-[#111111] placeholder:text-[#222222] placeholder:opacity-50 focus:outline-none focus:border-black transition-colors disabled:opacity-50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-light uppercase tracking-wide text-[#111111] mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Nhập địa chỉ email"
                  className="w-full px-0 py-3 border-b border-[#e5e5e5] bg-transparent text-sm font-light uppercase tracking-wide text-[#111111] placeholder:text-[#222222] placeholder:opacity-50 focus:outline-none focus:border-black transition-colors disabled:opacity-50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-light uppercase tracking-wide text-[#111111] mb-2">Số điện thoại</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={userData.phone_number}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Nhập số điện thoại"
                  className="w-full px-0 py-3 border-b border-[#e5e5e5] bg-transparent text-sm font-light uppercase tracking-wide text-[#111111] placeholder:text-[#222222] placeholder:opacity-50 focus:outline-none focus:border-black transition-colors disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-xs font-light uppercase tracking-wide text-[#111111] mb-2">Giới tính</label>
                <select
                  name="gender"
                  value={userData.gender}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-0 py-3 border-b border-[#e5e5e5] bg-transparent text-sm font-light uppercase tracking-wide text-[#111111] focus:outline-none focus:border-black transition-colors disabled:opacity-50"
                >
                  <option value="">Chọn giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-light uppercase tracking-wide text-[#111111] mb-2">Địa chỉ</label>
                <textarea
                  name="address"
                  value={userData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows="3"
                  placeholder="Nhập địa chỉ chi tiết"
                  className="w-full px-0 py-3 border-b border-[#e5e5e5] bg-transparent text-sm font-light uppercase tracking-wide text-[#111111] placeholder:text-[#222222] placeholder:opacity-50 focus:outline-none focus:border-black transition-colors resize-none disabled:opacity-50"
                />
              </div>
            </div>

            {/* Nút cập nhật thông tin */}
            {isEditing && (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={updateProfile}
                  disabled={loading}
                  className="px-6 py-2 bg-black text-white text-xs font-light uppercase tracking-wider hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    getUserProfile();
                  }}
                  disabled={loading}
                  className="px-6 py-2 bg-[#222222] text-white text-xs font-light uppercase tracking-wider hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Hủy
                </button>
              </div>
            )}
          </div>

          {/* Đổi mật khẩu */}
          <div className="border-t border-[#e5e5e5] pt-6 mt-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h3 className="text-sm sm:text-base font-light uppercase tracking-wider text-[#111111]">Đổi mật khẩu</h3>
              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                disabled={loading}
                className="px-4 py-2 bg-[#F5C842] text-black text-xs font-light uppercase tracking-wider hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
              >
                {showPasswordForm ? "Hủy" : "Đổi mật khẩu"}
              </button>
            </div>

            {showPasswordForm && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-light uppercase tracking-wide text-[#111111] mb-2">Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-0 py-3 border-b border-[#e5e5e5] bg-transparent text-sm font-light uppercase tracking-wide text-[#111111] placeholder:text-[#222222] placeholder:opacity-50 focus:outline-none focus:border-black transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-light uppercase tracking-wide text-[#111111] mb-2">Mật khẩu mới</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-0 py-3 border-b border-[#e5e5e5] bg-transparent text-sm font-light uppercase tracking-wide text-[#111111] placeholder:text-[#222222] placeholder:opacity-50 focus:outline-none focus:border-black transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-light uppercase tracking-wide text-[#111111] mb-2">Xác nhận mật khẩu mới</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-0 py-3 border-b border-[#e5e5e5] bg-transparent text-sm font-light uppercase tracking-wide text-[#111111] placeholder:text-[#222222] placeholder:opacity-50 focus:outline-none focus:border-black transition-colors"
                    required
                  />
                </div>

                <button
                  onClick={changePassword}
                  disabled={loading}
                  className="px-6 py-2 bg-black text-white text-xs font-light uppercase tracking-wider hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                >
                  {loading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
