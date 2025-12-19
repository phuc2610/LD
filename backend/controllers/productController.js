import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import productModel from "../models/productModel.js";

// function for add product
const addProduct = async (req,res) => {
    try {
        
        const {name , description , price , category , subCategory , sizes , bestseller, type, colors, stockBySize} = req.body

        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1 , image2 , image3 , image4].filter((item) => item !== undefined);

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path,{resource_type:'image'});
                return result.secure_url
            })
        )

        // Parse sizes/colors an toàn cho dữ liệu mới & cũ
        const safeParseArray = (value) => {
            if (!value) return [];
            if (Array.isArray(value)) return value;
            try {
                const parsed = JSON.parse(value);
                return Array.isArray(parsed) ? parsed : [];
            } catch (err) {
                return [];
            }
        }
        
        let parsedStock = {S:0,M:0,L:0,XL:0};
        if (stockBySize) {
            try {
                const maybe = JSON.parse(stockBySize);
                parsedStock = { ...parsedStock, ...maybe };
            } catch (err) {
                parsedStock = {S:0,M:0,L:0,XL:0};
            }
        }

        const productData = {
            name,
            description,
            price: Number(price),
            category,
            subCategory,
            type: type || "ACCESSORIES",
            bestseller: bestseller === "true" ? true : false,
            sizes: safeParseArray(sizes),
            colors: safeParseArray(colors),
            stockBySize: parsedStock,
            image: imagesUrl,
            // date: Date.now()
        }

        
        const product = new productModel(productData);
        await product.save();

        res.json({success:true,message:"Sản phẩm đã thêm"})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }


}

// function for list product
const listProducts = async (req,res) => {
    try {
        
        const products = await productModel.find({});
        res.json({success:true,products})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

// function for remove product
const removeProduct = async (req,res) => {
        try {

            await productModel.findByIdAndDelete(req.body.id)
            res.json({success:true,message:"Sản phẩm đã xóa thành công"})

        } catch (error) {
            console.log(error);
            res.json({success:false,message:error.message})
        }
}

// function for single product info
const singleProduct = async (req,res) => {
    
    try {
        
        const { productId } = req.body
        
        const product = await productModel.findById(productId)
        res.json({success:true,product})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }

}

// Get sold quantity for a product
const getProductSoldQuantity = async (req, res) => {
    try {
        const { productId } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.json({ success: true, soldQuantity: 0 });
        }

        const orderModel = (await import('../models/orderModel.js')).default;
        
        // Convert productId to string for matching (items._id is stored as string in orders)
        const productIdStr = productId.toString();
        
        const result = await orderModel.aggregate([
            {
                $unwind: "$items"
            },
            {
                $match: {
                    "items._id": { $in: [productId, productIdStr] },
                    "payment": true
                }
            },
            {
                $group: {
                    _id: null,
                    totalSold: { $sum: "$items.quantity" }
                }
            }
        ]);

        const soldQuantity = result.length > 0 ? result[0].totalSold : 0;

        res.json({
            success: true,
            soldQuantity: soldQuantity
        });
    } catch (error) {
        console.log(error);
        res.json({ success: true, soldQuantity: 0 });
    }
}

// function for update product
const updateProduct = async (req,res) => {
    try {
        const {id, name, description, price, category, subCategory, sizes, bestseller, type, colors, stockBySize, existingImages} = req.body

        // Get existing product
        const existingProduct = await productModel.findById(id);
        if (!existingProduct) {
            return res.json({success:false, message:"Không tìm thấy sản phẩm"});
        }

        // Handle new images
        const image1 = req.files?.image1 && req.files.image1[0]
        const image2 = req.files?.image2 && req.files.image2[0]
        const image3 = req.files?.image3 && req.files.image3[0]
        const image4 = req.files?.image4 && req.files.image4[0]

        const newImages = [image1, image2, image3, image4].filter((item) => item !== undefined);

        let newImagesUrl = [];
        if (newImages.length > 0) {
            newImagesUrl = await Promise.all(
                newImages.map(async (item) => {
                    let result = await cloudinary.uploader.upload(item.path, {resource_type:'image'});
                    return result.secure_url;
                })
            );
        }

        // Parse existing images
        let parsedExistingImages = [];
        if (existingImages) {
            try {
                parsedExistingImages = JSON.parse(existingImages);
            } catch (err) {
                parsedExistingImages = existingProduct.image || [];
            }
        } else {
            parsedExistingImages = existingProduct.image || [];
        }

        // Combine existing and new images
        const finalImages = [...parsedExistingImages, ...newImagesUrl];

        // Parse sizes/colors safely
        const safeParseArray = (value) => {
            if (!value) return [];
            if (Array.isArray(value)) return value;
            try {
                const parsed = JSON.parse(value);
                return Array.isArray(parsed) ? parsed : [];
            } catch (err) {
                return [];
            }
        }
        
        let parsedStock = {S:0,M:0,L:0,XL:0};
        if (stockBySize) {
            try {
                const maybe = JSON.parse(stockBySize);
                parsedStock = { ...parsedStock, ...maybe };
            } catch (err) {
                parsedStock = existingProduct.stockBySize || {S:0,M:0,L:0,XL:0};
            }
        }

        const updateData = {
            name,
            description,
            price: Number(price),
            category,
            subCategory,
            type: type || "ACCESSORIES",
            bestseller: bestseller === "true" ? true : false,
            sizes: safeParseArray(sizes),
            colors: safeParseArray(colors),
            stockBySize: parsedStock,
            image: finalImages.length > 0 ? finalImages : existingProduct.image,
        }

        await productModel.findByIdAndUpdate(id, updateData);
        res.json({success:true, message:"Sản phẩm đã được cập nhật thành công"});

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message});
    }
}

export {listProducts , addProduct , removeProduct , singleProduct, updateProduct, getProductSoldQuantity};