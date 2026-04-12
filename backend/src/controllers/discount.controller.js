import { Discount } from "../models/discount.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

const getDiscounts = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const total = await Discount.countDocuments();
    const discounts = await Discount.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

    return res.status(200).json(new apiResponse(200, {
        data: discounts, total, page: Number(page), totalPages: Math.ceil(total / limit),
    }, "Discounts fetched"));
});

const createDiscount = asyncHandler(async (req, res) => {
    const { code, discount, type, minOrder, usageLimit } = req.body;
    if (!code || !discount) throw new apiError(400, "Code and discount value are required");

    const exists = await Discount.findOne({ code: code.toUpperCase() });
    if (exists) throw new apiError(400, "Discount code already exists");

    const doc = await Discount.create({
        code: code.toUpperCase(), discount: Number(discount),
        type: type || "percent", minOrder: Number(minOrder || 0),
        usageLimit: Number(usageLimit || 100), active: true, used: 0,
    });
    return res.status(201).json(new apiResponse(201, doc, "Discount created"));
});

const updateDiscount = asyncHandler(async (req, res) => {
    const doc = await Discount.findById(req.params.id);
    if (!doc) throw new apiError(404, "Discount not found");

    const { code, discount, type, minOrder, usageLimit } = req.body;
    const updated = await Discount.findByIdAndUpdate(req.params.id, {
        code: code ? code.toUpperCase() : doc.code,
        discount: discount !== undefined ? Number(discount) : doc.discount,
        type: type || doc.type,
        minOrder: minOrder !== undefined ? Number(minOrder) : doc.minOrder,
        usageLimit: usageLimit !== undefined ? Number(usageLimit) : doc.usageLimit,
    }, { new: true });
    return res.status(200).json(new apiResponse(200, updated, "Discount updated"));
});

const toggleDiscountActive = asyncHandler(async (req, res) => {
    const doc = await Discount.findById(req.params.id);
    if (!doc) throw new apiError(404, "Discount not found");
    doc.active = !doc.active;
    await doc.save();
    return res.status(200).json(new apiResponse(200, doc, `Discount ${doc.active ? "activated" : "deactivated"}`));
});

const deleteDiscount = asyncHandler(async (req, res) => {
    const doc = await Discount.findById(req.params.id);
    if (!doc) throw new apiError(404, "Discount not found");
    await Discount.findByIdAndDelete(req.params.id);
    return res.status(200).json(new apiResponse(200, {}, "Discount deleted"));
});

const validateDiscount = asyncHandler(async (req, res) => {
    const { code, cartTotal } = req.body;
    if (!code) throw new apiError(400, "Coupon code is required");

    const doc = await Discount.findOne({ code: code.toUpperCase(), active: true });
    if (!doc) throw new apiError(400, "Invalid or expired coupon code");
    if (doc.used >= doc.usageLimit) throw new apiError(400, "This coupon has reached its usage limit");
    if (cartTotal && doc.minOrder > 0 && Number(cartTotal) < doc.minOrder) {
        throw new apiError(400, `Minimum order of Rs.${doc.minOrder} required for this coupon`);
    }

    const discountAmount = doc.type === "percent"
        ? Math.round((Number(cartTotal || 0) * doc.discount) / 100)
        : doc.discount;

    return res.status(200).json(new apiResponse(200, {
        code: doc.code, discount: doc.discount, type: doc.type,
        discountAmount, minOrder: doc.minOrder,
    }, "Coupon applied"));
});

export { getDiscounts, createDiscount, updateDiscount, toggleDiscountActive, deleteDiscount, validateDiscount };
