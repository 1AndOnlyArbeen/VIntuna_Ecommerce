import { Category } from "../models/category.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getCategories = asyncHandler(async (req, res) => {
    const { page = 1, limit = 100 } = req.query;
    const total = await Category.countDocuments();
    const categories = await Category.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

    return res.status(200).json(new apiResponse(200, {
        data: categories, total, page: Number(page), totalPages: Math.ceil(total / limit),
    }, "Categories fetched"));
});

const getCategoryById = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) throw new apiError(404, "Category not found");
    return res.status(200).json(new apiResponse(200, category, "Category fetched"));
});

const createCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;
    if (!name) throw new apiError(400, "Category name is required");

    let imageUrl = "";
    if (req.file) {
        const result = await uploadOnCloudinary(req.file.path);
        if (result) imageUrl = result.secure_url;
    }

    const category = await Category.create({ name, image: imageUrl });
    return res.status(201).json(new apiResponse(201, category, "Category created"));
});

const updateCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) throw new apiError(404, "Category not found");

    let imageUrl = category.image;
    if (req.file) {
        const result = await uploadOnCloudinary(req.file.path);
        if (result) imageUrl = result.secure_url;
    }

    const updated = await Category.findByIdAndUpdate(req.params.id,
        { name: req.body.name || category.name, image: imageUrl },
        { new: true }
    );
    return res.status(200).json(new apiResponse(200, updated, "Category updated"));
});

const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) throw new apiError(404, "Category not found");
    await Category.findByIdAndDelete(req.params.id);
    return res.status(200).json(new apiResponse(200, {}, "Category deleted"));
});

export { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
