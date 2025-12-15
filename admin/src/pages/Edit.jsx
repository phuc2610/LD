import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import axios from 'axios'
import {backendUrl} from '../App'
import {toast} from 'react-toastify'

const TYPE_OPTIONS = [
  "JEWELRY","MINI POUCH","FLANNEL","PHONE CASES","BOWLER BAGS","JERSEY","BEANIES","POLOS",
  "SHIRTS","TANK TOP","UNDERWEAR","INNERWEAR","SLIDES","SOCKS","CROSSBODY BAGS","CAPS","JEANS",
  "JACKETS","SWEATSHIRTS","PANTS","TOTE BAGS","CARDIGANS","SHORTS","VEST","ACCESSORIES",
  "SHOULDER BAGS","HOODIES","LONGSLEEVES","T-SHIRTS","BACKPACKS"
];

const SIZE_OPTIONS = ["S","M","L","XL"];

const COLOR_OPTIONS = ["Red","Orange","Yellow","Green","Blue","Purple","Pink","Brown","White","Grey","Black","Multi-Colour"];

const Edit = ({token}) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  const [image1,setImage1] = useState(null)
  const [image2,setImage2] = useState(null)
  const [image3,setImage3] = useState(null)
  const [image4,setImage4] = useState(null)
  const [existingImages, setExistingImages] = useState([])

  const [name , setName] = useState("");
  const [description , setDescription] = useState("");
  const [price , setPrice] = useState("");
  const [category , setCategory] = useState("Local Brand");
  const [subCategory , setSubCategory] = useState("Streetwear");
  const [type , setType] = useState("T-SHIRTS");
  const [bestseller , setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [stockBySize, setStockBySize] = useState({S:0,M:0,L:0,XL:0});

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.post(backendUrl + "/api/product/single", { productId: id });
        if (response.data.success) {
          const product = response.data.product;
          setName(product.name || "");
          setDescription(product.description || "");
          setPrice(product.price || "");
          setCategory(product.category || "Local Brand");
          setSubCategory(product.subCategory || "Streetwear");
          setType(product.type || "T-SHIRTS");
          setBestseller(product.bestseller || false);
          setSizes(product.sizes || []);
          setColors(product.colors || []);
          setStockBySize(product.stockBySize || {S:0,M:0,L:0,XL:0});
          setExistingImages(product.image || []);
        } else {
          toast.error(response.data.message || "Không tìm thấy sản phẩm");
          navigate("/list");
        }
      } catch (error) {
        console.log(error);
        toast.error("Lỗi khi tải thông tin sản phẩm");
        navigate("/list");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, navigate]);

  const toggleSize = (value) => {
    setSizes((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const toggleColor = (value) => {
    setColors((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const onSubmitHandler = async(e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("id", id);
      formData.append("name",name);
      formData.append("description",description);
      formData.append("price",price);
      formData.append("category",category);
      formData.append("subCategory",subCategory);
      formData.append("type",type);
      formData.append("bestseller",bestseller);
      formData.append("sizes",JSON.stringify(sizes));
      formData.append("colors",JSON.stringify(colors));
      formData.append("stockBySize", JSON.stringify(stockBySize));

      // Append existing images that are still being used
      if (existingImages && existingImages.length > 0) {
        formData.append("existingImages", JSON.stringify(existingImages));
      }

      // Append new images if any
      image1 && formData.append("image1",image1);
      image2 && formData.append("image2",image2);
      image3 && formData.append("image3",image3);
      image4 && formData.append("image4",image4);

      const response = await axios.post(backendUrl + "/api/product/update",formData,{headers:{token}});
      
      if(response.data.success){
        toast.success(response.data.message);
        navigate("/list");
      } else {
        toast.error(response.data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">Đang tải thông tin sản phẩm...</p>
      </div>
    );
  }

  return (
    <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Sửa sản phẩm</h2>
          <p className="text-gray-600">Cập nhật thông tin sản phẩm</p>
        </div>

        <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-4'>
            <div>
              <p className='mb-2 font-bold text-gray-700'>Hình ảnh hiện tại</p>
              {existingImages.length > 0 && (
                <div className='flex gap-2 flex-wrap mb-4'>
                  {existingImages.map((img, index) => (
                    <div key={index} className="relative">
                      <img className='w-20 h-20 object-cover rounded border border-gray-300' src={img} alt={`Image ${index + 1}`} />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <p className='mb-2 font-bold text-gray-700'>Tải lên hình ảnh mới (tùy chọn)</p>
              <div className='flex gap-2 flex-wrap'>
                <label htmlFor="image1">
                  <img className='w-20 h-20 object-cover cursor-pointer border border-gray-300 rounded' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="" />
                  <input onChange={(e) => setImage1(e.target.files[0])} type="file" id="image1" hidden />
                </label>
                <label htmlFor="image2">
                  <img className='w-20 h-20 object-cover cursor-pointer border border-gray-300 rounded' src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt="" />
                  <input onChange={(e) => setImage2(e.target.files[0])} type="file" id="image2" hidden />
                </label>
                <label htmlFor="image3">
                  <img className='w-20 h-20 object-cover cursor-pointer border border-gray-300 rounded' src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt="" />
                  <input onChange={(e) => setImage3(e.target.files[0])} type="file" id="image3" hidden />
                </label>
                <label htmlFor="image4">
                  <img className='w-20 h-20 object-cover cursor-pointer border border-gray-300 rounded' src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt="" />
                  <input onChange={(e) => setImage4(e.target.files[0])} type="file" id="image4" hidden />
                </label>
              </div>
            </div>

            <div className='w-full'>
              <p className='mb-2 font-bold text-gray-700'>Tên sản phẩm</p>
              <input onChange={(e) => setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2 border border-gray-200 rounded' type="text" placeholder='Nhập tên sản phẩm' required />
            </div>

            <div className='w-full'>
              <p className='mb-2 font-bold text-gray-700'>Mô tả sản phẩm</p>
              <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2 border border-gray-200 rounded' type="text" placeholder='Nhập nội dung mô tả sản phẩm' required />
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full'>

                <div>
                  <p className='mb-2 font-bold text-gray-700'>Loại sản phẩm (Type)</p>
                  <select value={type} onChange={(e) => setType(e.target.value)}  className='w-full px-3 py-2 border border-gray-200 rounded'>
                    {TYPE_OPTIONS.map((option)=>(
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <p className='mb-2 font-bold text-gray-700'>Thương hiệu / Brand</p>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}  className='w-full px-3 py-2 border border-gray-200 rounded'>
                      <option value="Local Brand">Local Brand</option>
                      <option value="International">International</option>
                      <option value="Vintage">Vintage</option>
                      <option value="Collaboration">Collaboration</option>
                  </select>
                </div>

                 <div>
                  <p className='mb-2 font-bold text-gray-700'>Bộ sưu tập / Style</p>
                  <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} className='w-full px-3 py-2 border border-gray-200 rounded'>
                      <option value="Streetwear">Streetwear</option>
                      <option value="Athleisure">Athleisure</option>
                      <option value="Casual">Casual</option>
                      <option value="Minimal">Minimal</option>
                  </select>
                </div>

                <div>
                  <p className='mb-2 font-bold text-gray-700'>Giá sản phẩm</p>
                  <input onChange={(e) => setPrice(e.target.value)} value={price} className='w-full px-3 py-2 border border-gray-200 rounded' type="number" min="0" placeholder='...đ' required />
                </div>

            </div>

            <div className='w-full'>
              <p className='mb-2 text-gray-700 font-bold'>Kích cỡ (Size)</p>
              <div className='flex flex-wrap gap-3'>
                {SIZE_OPTIONS.map((item)=>(
                  <button
                    type="button"
                    key={item}
                    onClick={() => toggleSize(item)}
                    className={`${sizes.includes(item) ? "bg-black text-white" : "bg-slate-200 text-gray-700"} px-3 py-1 rounded cursor-pointer text-sm`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className='w-full'>
              <p className='mb-2 text-gray-700 font-bold'>Tồn kho theo size</p>
              <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
                {["S","M","L","XL"].map((s)=>(
                  <div key={s} className='flex flex-col gap-1'>
                    <label className='text-sm font-medium text-gray-700'>{s}</label>
                    <input
                      type="number"
                      min="0"
                      value={stockBySize[s]}
                      onChange={(e)=> setStockBySize(prev => ({...prev, [s]: Number(e.target.value)}))}
                      className='px-3 py-2 border border-gray-200 rounded'
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className='w-full'>
              <p className='mb-2 text-gray-700 font-bold'>Màu sắc</p>
              <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2'>
                {COLOR_OPTIONS.map((color)=>(
                  <label key={color} className='flex items-center gap-2 text-sm cursor-pointer'>
                    <input
                      type="checkbox"
                      checked={colors.includes(color)}
                      onChange={() => toggleColor(color)}
                      className='w-4 h-4'
                    />
                    <span>{color}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className='flex gap-2 mt-2'>
              <input onChange={() => setBestseller(prev => !prev)} checked={bestseller} type="checkbox" id='bestseller' className='w-4 h-4' />
              <label className='cursor-pointer' htmlFor="bestseller">Thêm vào danh sách bán chạy nhất</label>
            </div>

            <div className='flex gap-4 mt-4'>
              <button type='submit' className='w-32 py-3 bg-black text-white cursor-pointer rounded-lg hover:bg-gray-700 transition ease-in-out text-sm font-semibold uppercase tracking-wide'>Cập nhật</button>
              <button type='button' onClick={() => navigate("/list")} className='w-32 py-3 bg-gray-300 text-gray-700 cursor-pointer rounded-lg hover:bg-gray-400 transition ease-in-out text-sm font-semibold uppercase tracking-wide'>Hủy</button>
            </div>

        </form>
    </div>
  )
}

export default Edit

