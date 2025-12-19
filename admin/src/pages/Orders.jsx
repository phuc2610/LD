import React, { useEffect, useState, useMemo } from 'react'
import axios from 'axios'
import {backendUrl, currency} from '../App'
import {toast} from 'react-toastify'
import { assets } from '../assets/assets'

const Orders = ({token}) => {

  const [orders, setOrders] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [sortOrder, setSortOrder] = useState('newest') // 'newest' or 'oldest'
  const [statusFilter, setStatusFilter] = useState('all') // 'all', 'Đã đặt hàng', 'Đang đóng gói', etc.
  const ordersPerPage = 5

  const fetchAllOrders = async () => {
    if(!token){
        return null;
    }

    try {
      const response = await axios.post(backendUrl + '/api/order/list',{},{headers:{token}});
      if(response.data.success){
        setOrders(response.data.orders)
      }
      else {
        toast.error(response.data.message)
      }
      
    } catch (error) {
      toast.error(error.message)
    }
  }

  const statusHandler = async ( event , orderId ) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/status' , {orderId , status: event.target.value} , {headers:{token}});
      if(response.data.success){
        await fetchAllOrders();
      }
    
    } catch (error) {
      console.log(error);
      toast.error(error.message || 'Có lỗi xảy ra khi cập nhật trạng thái đơn hàng');
    }
  }

  useEffect(() =>{
    fetchAllOrders()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[token])

  // Filter and sort orders
  const filteredAndSortedOrders = useMemo(() => {
    let filtered = orders;
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = orders.filter(order => order.status === statusFilter);
    }
    
    // Sort by date
    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      if (sortOrder === 'newest') {
        return dateB - dateA; // Newest first
      } else {
        return dateA - dateB; // Oldest first
      }
    });
    
    return sorted;
  }, [orders, sortOrder, statusFilter]);

  // Tính toán các đơn hàng hiển thị theo trang
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredAndSortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredAndSortedOrders.length / ordersPerPage);

  // Hàm chuyển trang
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };


  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <svg className="w-8 h-8 mr-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V7l-7-5z" clipRule="evenodd"/>
                </svg>
                Quản lý đơn hàng
              </h1>
              <p className="text-gray-600 mt-1">Theo dõi và xử lý tất cả đơn hàng của khách hàng</p>
            </div>
            <div className="text-right">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 font-semibold text-lg">{filteredAndSortedOrders.length}</p>
                <p className="text-blue-600 text-sm">Tổng đơn hàng</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats, Filters và Pagination Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Hiển thị</span>
              <span className="font-semibold text-blue-600">{indexOfFirstOrder + 1} - {Math.min(indexOfLastOrder, filteredAndSortedOrders.length)}</span>
              <span className="text-gray-600">trên</span>
              <span className="font-semibold text-blue-600">{filteredAndSortedOrders.length}</span>
              <span className="text-gray-600">đơn hàng</span>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              {/* Sort by date */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Sắp xếp:</label>
                <select
                  value={sortOrder}
                  onChange={(e) => {
                    setSortOrder(e.target.value);
                    setCurrentPage(1); // Reset to first page when sorting changes
                  }}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="newest">Mới nhất → Cũ nhất</option>
                  <option value="oldest">Cũ nhất → Mới nhất</option>
                </select>
              </div>
              {/* Filter by status */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Lọc:</label>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1); // Reset to first page when filter changes
                  }}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tất cả</option>
                  <option value="Đã đặt hàng">Đã đặt hàng</option>
                  <option value="Đang đóng gói">Đang đóng gói</option>
                  <option value="Đang giao hàng">Đang giao hàng</option>
                  <option value="Đã giao hàng">Đã giao hàng</option>
                </select>
              </div>
              <div className="text-sm text-gray-500">
                Trang {currentPage} / {totalPages}
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {
            currentOrders.map((order,index)=>(
              <div className='bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden' key={index}>
                {/* Header với Order ID và Status */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg flex items-center justify-center">
                      {order.items && order.items.length > 0 && order.items[0].image && order.items[0].image[0] ? (
                        <img 
                          className='w-10 h-10 object-cover rounded' 
                          src={order.items[0].image[0]} 
                          alt={order.items[0].name || "Sản phẩm"}
                          onError={(e) => {
                            // Fallback to parcel icon if image fails to load
                            e.target.src = assets.parcel_icon;
                            e.target.className = 'w-6 h-6';
                          }}
                        />
                      ) : (
                        <img className='w-6 h-6' src={assets.parcel_icon} alt="" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Đơn hàng #{order._id.slice(-8)}</h4>
                      <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('vi-VN')} - {new Date(order.createdAt).toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'})}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-bold text-orange-600">{order.amount.toLocaleString('vi-VN')}{currency}</span>
                    <select onChange = {(event) => statusHandler(event , order._id)} value={order.status} 
                      className={`px-3 py-2 rounded-lg font-medium cursor-pointer border-0 focus:ring-2 focus:ring-blue-400 ${
                        order.status === 'Đã giao hàng' ? 'bg-green-100 text-green-800' :
                        order.status === 'Đang giao hàng' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Đang đóng gói' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        <option value="Đã đặt hàng">Đã đặt hàng</option>
                        <option value="Đang đóng gói">Đang đóng gói</option>
                        <option value="Đang giao hàng">Đang giao hàng</option>
                        <option value="Đã giao hàng">Đã giao hàng</option>
                    </select>
                  </div>
                </div>

                {/* Main Content */}
                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Thông tin sản phẩm */}
                  <div className="lg:col-span-1">
                    <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm mr-2">
                        {order.items.length} sản phẩm
                      </span>
                      Chi tiết đơn hàng
                    </h5>
                    <div className="space-y-2 max-h-32 overflow-y-auto bg-gray-50 p-3 rounded-lg">
                      {order.items.map((item,index)=>{
                        const productImage = (item.image && Array.isArray(item.image) && item.image[0]) 
                          ? item.image[0] 
                          : (item.image && typeof item.image === 'string' ? item.image : null);
                        
                        return (
                          <div key={index} className="flex items-center gap-2 text-sm border-b border-gray-200 pb-2 last:border-b-0">
                            {productImage ? (
                              <img 
                                src={productImage} 
                                alt={item.name || "Sản phẩm"}
                                className="w-10 h-10 object-cover rounded border border-gray-200 flex-shrink-0"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gray-200 rounded border border-gray-200 flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                            <div className="flex-1 flex justify-between items-center min-w-0">
                              <span className="text-gray-700 font-medium truncate">{item.name || "Sản phẩm"}</span>
                              <span className="text-gray-600 ml-2 flex-shrink-0">x{item.quantity} {item.size && `(${item.size})`}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Thông tin khách hàng */}
                  <div className="lg:col-span-1">
                    <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                      </svg>
                      Thông tin khách hàng
                    </h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start">
                        <span className="font-medium text-gray-600 w-20">Tên:</span>
                        <span className="text-gray-800 font-medium">{order.address.firstName + " " + order.address.lastName}</span>
                      </div>
                      <div className="flex items-start">
                        <span className="font-medium text-gray-600 w-20">Địa chỉ:</span>
                        <span className="text-gray-700 flex-1">
                          {order.address.street}<br/>
                          {order.address.city}, {order.address.state}<br/>
                          {order.address.country}, {order.address.zipcode}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium text-gray-600 w-20">SĐT:</span>
                        <span className="text-gray-800">{order.address.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Thông tin thanh toán */}
                  <div className="lg:col-span-1">
                    <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
                      </svg>
                      Thanh toán
                    </h5>
                    <div className="space-y-3">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Phương thức:</span>
                          <span className="font-medium text-gray-800 bg-white px-2 py-1 rounded text-sm">
                            {order.paymentMethod}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Trạng thái:</span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            order.payment 
                              ? 'bg-green-100 text-green-800 border border-green-200' 
                              : 'bg-red-100 text-red-800 border border-red-200'
                          }`}>
                            {order.payment ? '✓ Đã thanh toán' : '✗ Chưa thanh toán'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
            <div className="flex justify-center items-center">
              <div className="flex items-center space-x-2">
                {/* Nút Previous */}
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md'
                  }`}
                >
                  ← Trước
                </button>

                {/* Số trang */}
                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        currentPage === number
                          ? 'bg-blue-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {number}
                    </button>
                  ))}
                </div>

                {/* Nút Next */}
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md'
                  }`}
                >
                  Sau →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders