import { Banner } from "../models/banner.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getBanners = asyncHandler(async (req, res) => {
    const { active, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (active === "true") filter.active = true;

    const total = await Banner.countDocuments(filter);
    const banners = await Banner.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

    return res.status(200).json(new apiResponse(200, {
        data: banners, total, page: Number(page), totalPages: Math.ceil(total / limit),
    }, "Banners fetched"));
});

const createBanner = asyncHandler(async (req, res) => {
    const { title, subtitle, buttonText, link } = req.body;
    if (!title) throw new apiError(400, "Banner title is required");

    let imageUrl = "";
    if (req.file) {
        const result = await uploadOnCloudinary(req.file.path);
        if (result) imageUrl = result.secure_url;
    }

    const banner = await Banner.create({
        title, subtitle: subtitle || "", buttonText: buttonText || "Shop Now",
        link: link || "/", image: imageUrl, active: true,
    });
    return res.status(201).json(new apiResponse(201, banner, "Banner created"));
});

const updateBanner = asyncHandler(async (req, res) => {
    const banner = await Banner.findById(req.params.id);
    if (!banner) throw new apiError(404, "Banner not found");

    const { title, subtitle, buttonText, link } = req.body;
    let imageUrl = banner.image;
    if (req.file) {
        const result = await uploadOnCloudinary(req.file.path);
        if (result) imageUrl = result.secure_url;
    }

    const updated = await Banner.findByIdAndUpdate(req.params.id, {
        title: title || banner.title,
        subtitle: subtitle !== undefined ? subtitle : banner.subtitle,
        buttonText: buttonText || banner.buttonText,
        link: link || banner.link,
        image: imageUrl,
    }, { new: true });
    return res.status(200).json(new apiResponse(200, updated, "Banner updated"));
});

const toggleBannerActive = asyncHandler(async (req, res) => {
    const banner = await Banner.findById(req.params.id);
    if (!banner) throw new apiError(404, "Banner not found");
    banner.active = !banner.active;
    await banner.save();
    return res.status(200).json(new apiResponse(200, banner, `Banner ${banner.active ? "activated" : "deactivated"}`));
});

const deleteBanner = asyncHandler(async (req, res) => {
    const banner = await Banner.findById(req.params.id);
    if (!banner) throw new apiError(404, "Banner not found");
    await Banner.findByIdAndDelete(req.params.id);
    return res.status(200).json(new apiResponse(200, {}, "Banner deleted"));
});

export { getBanners, createBanner, updateBanner, toggleBannerActive, deleteBanner };
