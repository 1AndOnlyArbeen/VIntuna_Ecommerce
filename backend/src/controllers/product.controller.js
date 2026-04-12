import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getProducts = asyncHandler(async (req, res) => {
    const { category, featured, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (featured === "true") filter.featured = true;

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

    return res.status(200).json(new apiResponse(200, {
        data: products,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit),
    }, "Products fetched"));
});

const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) throw new apiError(404, "Product not found");
    return res.status(200).json(new apiResponse(200, product, "Product fetched"));
});

const searchProducts = asyncHandler(async (req, res) => {
    const { q, page = 1, limit = 50 } = req.query;
    if (!q) throw new apiError(400, "Search query is required");

    const filter = {
        $or: [
            { name: { $regex: q, $options: "i" } },
            { category: { $regex: q, $options: "i" } },
            { description: { $regex: q, $options: "i" } },
        ],
    };
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

    return res.status(200).json(new apiResponse(200, {
        data: products, total, page: Number(page), totalPages: Math.ceil(total / limit),
    }, "Search results"));
});

const createProduct = asyncHandler(async (req, res) => {
    const { name, category, price, originalPrice, description, unit, stock, tags, inStock, deliveryTime } = req.body;
    if (!name || !price) throw new apiError(400, "Name and price are required");

    let imageUrls = [];
    if (req.files && req.files.length > 0) {
        for (const file of req.files) {
            const result = await uploadOnCloudinary(file.path);
            if (result) imageUrls.push(result.secure_url);
        }
    }

    const product = await Product.create({
        name,
        category: category || "",
        price: Number(price),
        originalPrice: Number(originalPrice || price),
        description: description || "",
        unit: unit || "",
        stock: Number(stock || 0),
        tags: tags ? (typeof tags === "string" ? JSON.parse(tags) : tags) : [],
        inStock: inStock !== undefined ? inStock === "true" || inStock === true : true,
        deliveryTime: deliveryTime || "",
        image: imageUrls,
    });

    return res.status(201).json(new apiResponse(201, product, "Product created"));
});

const updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) throw new apiError(404, "Product not found");

    const { name, category, price, originalPrice, description, unit, stock, tags, inStock, deliveryTime } = req.body;

    let imageUrls = product.image || [];
    if (req.files && req.files.length > 0) {
        imageUrls = [];
        for (const file of req.files) {
            const result = await uploadOnCloudinary(file.path);
            if (result) imageUrls.push(result.secure_url);
        }
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, {
        name: name || product.name,
        category: category !== undefined ? category : product.category,
        price: price !== undefined ? Number(price) : product.price,
        originalPrice: originalPrice !== undefined ? Number(originalPrice) : product.originalPrice,
        description: description !== undefined ? description : product.description,
        unit: unit !== undefined ? unit : product.unit,
        stock: stock !== undefined ? Number(stock) : product.stock,
        tags: tags ? (typeof tags === "string" ? JSON.parse(tags) : tags) : product.tags,
        inStock: inStock !== undefined ? (inStock === "true" || inStock === true) : product.inStock,
        deliveryTime: deliveryTime !== undefined ? deliveryTime : product.deliveryTime,
        image: imageUrls,
    }, { new: true });

    return res.status(200).json(new apiResponse(200, updated, "Product updated"));
});

const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) throw new apiError(404, "Product not found");
    await Product.findByIdAndDelete(req.params.id);
    return res.status(200).json(new apiResponse(200, {}, "Product deleted"));
});

const toggleFeatured = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) throw new apiError(404, "Product not found");
    product.featured = !product.featured;
    await product.save();
    return res.status(200).json(new apiResponse(200, product, `Product ${product.featured ? "featured" : "unfeatured"}`));
});

export { getProducts, getProductById, searchProducts, createProduct, updateProduct, deleteProduct, toggleFeatured };
