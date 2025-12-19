import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = ' đ';
    const delivery_fee = 30000;
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [search,setSearch] = useState('');
    const [showSearch , setShowSearch] = useState(false);
    const[cartItems , setCartItems] = useState({});
    const [products , setProducts] = useState([]);
    const [token ,setToken] = useState('');
    const [user , setUser] = useState(null);
    const [wishlist, setWishlist] = useState([]);
    const navigate = useNavigate();




    const addToCart = async(itemId , size) =>{
        // Get product info to check sizes
        const product = products.find(p => p._id === itemId);
        
        // If product has multiple sizes and no size selected, show error
        if (product && product.sizes && product.sizes.length > 1 && !size) {
            toast.error('Vui lòng chọn size sản phẩm !');
            return;
        }
        
        // If no size provided but product has 1 or 0 sizes, use default
        let finalSize = size;
        if (!finalSize) {
            if (product && product.sizes && product.sizes.length === 1) {
                finalSize = product.sizes[0];
            } else {
                finalSize = 'ONE_SIZE'; // Default for products without sizes
            }
        }
        
        toast.success('Sản phẩm đã được thêm vào giỏ hàng');


        let cartData = structuredClone(cartItems);
        
        if(cartData[itemId]){
            if(cartData[itemId][finalSize]){
                cartData[itemId][finalSize] +=1;
            }
            else{
                cartData[itemId][finalSize] =1;
            }
        }
        else{
            cartData[itemId] = {};
            cartData[itemId][finalSize] = 1;
        }
        setCartItems(cartData);

        if(token) {
            try {

                await axios.post(backendUrl + '/api/cart/add' , {itemId, size: finalSize} , {headers:{token}});

            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }

    }

    const getCartCount = () =>{
        let totalCount = 0;
        for(const items in cartItems){
            for(const item in cartItems[items]){
                try {
                    if(cartItems[items][item] > 0){
                        totalCount += cartItems[items][item];
                    }
                    
                } catch (error) {
                    console.log(error);
                    toast.error(error.message);
                }
            }
        }
        return totalCount;
    }

    const updateQuantity = async(itemId ,size ,quantity) =>{
        let cartData = structuredClone(cartItems);

        cartData[itemId][size] = quantity;
        setCartItems(cartData);

        if(token) {
            try {
                await axios.post(backendUrl + '/api/cart/update' , {itemId,size,quantity} , {headers:{token}});
            } catch (error) {
                console.log(error);
            }
        }
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for(const items in cartItems){
            let itemInfo = products.find((product) => product._id === items);
            for(const item in cartItems[items]){
                try {
                    if(cartItems[items][item] > 0){
                        totalAmount += itemInfo.price * cartItems[items][item];
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }
        return totalAmount;
    }

    const getProductsData = async () =>{
      
        try {
            const response = await axios.get(backendUrl + '/api/product/list');
            if(response.data.success){
                setProducts(response.data.products);
                
            } else {
                toast.error(response.data.message);
            }
            
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const getUserCart = async (token) => {
        try {
            const response = await axios.post(backendUrl + '/api/cart/get' , {} , {headers:{token}});
            if(response.data.success){
                setCartItems(response.data.cartData);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    useEffect(() => {
        getProductsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    // Wishlist functions
    const addToWishlist = async (productId) => {
        if (!token) {
            toast.error('Vui lòng đăng nhập để thêm sản phẩm vào yêu thích');
            navigate('/login');
            return;
        }

        if (!wishlist.includes(productId)) {
            const newWishlist = [...wishlist, productId];
            setWishlist(newWishlist);
            localStorage.setItem('wishlist', JSON.stringify(newWishlist));
            toast.success('Đã thêm vào yêu thích');
            
            try {
                await axios.post(backendUrl + '/api/wishlist/add', { productId }, { headers: { token } });
            } catch (error) {
                console.log(error);
                toast.error('Không thể đồng bộ với server');
            }
        }
    };

    const removeFromWishlist = async (productId) => {
        if (!token) {
            toast.error('Vui lòng đăng nhập để xóa sản phẩm khỏi yêu thích');
            navigate('/login');
            return;
        }

        const newWishlist = wishlist.filter(id => id !== productId);
        setWishlist(newWishlist);
        localStorage.setItem('wishlist', JSON.stringify(newWishlist));
        toast.success('Đã xóa khỏi yêu thích');
        
        try {
            await axios.post(backendUrl + '/api/wishlist/remove', { productId }, { headers: { token } });
        } catch (error) {
            console.log(error);
            toast.error('Không thể đồng bộ với server');
        }
    };

    const toggleWishlist = async (productId) => {
        if (!token) {
            toast.error('Vui lòng đăng nhập để sử dụng tính năng yêu thích');
            navigate('/login');
            return;
        }

        if (wishlist.includes(productId)) {
            await removeFromWishlist(productId);
        } else {
            await addToWishlist(productId);
        }
    };

    const isInWishlist = (productId) => {
        return wishlist.includes(productId);
    };

    const getWishlist = async (token) => {
        if (!token) {
            // Load from localStorage if no token
            const savedWishlist = localStorage.getItem('wishlist');
            if (savedWishlist) {
                try {
                    setWishlist(JSON.parse(savedWishlist));
                } catch (error) {
                    console.log(error);
                }
            }
            return;
        }
        
        try {
            const response = await axios.get(backendUrl + '/api/wishlist/get', { headers: { token } });
            if (response.data.success) {
                setWishlist(response.data.wishlist || []);
                localStorage.setItem('wishlist', JSON.stringify(response.data.wishlist || []));
            }
        } catch (error) {
            console.log(error);
            // Fallback to localStorage
            const savedWishlist = localStorage.getItem('wishlist');
            if (savedWishlist) {
                try {
                    setWishlist(JSON.parse(savedWishlist));
                } catch (error) {
                    console.log(error);
                }
            }
        }
    };

    useEffect(() =>{
        const savedToken = localStorage.getItem('token');
        if(!token && savedToken){
            setToken(savedToken);
            getUserCart(savedToken);
            getWishlist(savedToken);
        } else if (token) {
            getWishlist(token);
        }
        
        if(!user && localStorage.getItem('user')){
            try {
                setUser(JSON.parse(localStorage.getItem('user')));
            } catch (error) {
                console.log('Error parsing user from localStorage:', error);
            }
        }
        
        // Load wishlist from localStorage on mount if no token
        if (!token && !savedToken) {
            getWishlist();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const value = {
        products , currency , delivery_fee,
        search, setSearch,showSearch, setShowSearch,
        cartItems , addToCart , setCartItems ,
        getCartCount , updateQuantity ,
        getCartAmount, navigate , backendUrl,
        setToken,token , user , setUser,
        wishlist, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist, getWishlist,
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;