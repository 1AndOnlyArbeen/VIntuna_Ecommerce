import { Review } from "../models/review.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

const getProductReviews = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const filter = { productId: req.params.productId };
    const total = await Review.countDocuments(filter);
    const reviews = await Review.find(filter)
        .populate("userId", "name avatar")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

    // compute average rating
    const stats = await Review.aggregate([
        { $match: { productId: reviews.length > 0 ? reviews[0].productId : null } },
        { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 },
            r5: { $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] } },
            r4: { $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] } },
            r3: { $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] } },
            r2: { $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] } },
            r1: { $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] } },
        }},
    ]);

    const ratingStats = stats[0] || { avg: 0, count: 0, r5: 0, r4: 0, r3: 0, r2: 0, r1: 0 };

    return res.status(200).json(new apiResponse(200, {
        data: reviews, total, page: Number(page), totalPages: Math.ceil(total / limit),
        avgRating: Math.round(ratingStats.avg * 10) / 10 || 0,
        totalReviews: ratingStats.count,
        breakdown: { 5: ratingStats.r5, 4: ratingStats.r4, 3: ratingStats.r3, 2: ratingStats.r2, 1: ratingStats.r1 },
    }, "Reviews fetched"));
});

const createReview = asyncHandler(async (req, res) => {
    const { productId, rating, title, body } = req.body;
    if (!productId || !rating) throw new apiError(400, "Product and rating are required");
    if (rating < 1 || rating > 5) throw new apiError(400, "Rating must be 1-5");

    const existing = await Review.findOne({ userId: req.user._id, productId });
    if (existing) throw new apiError(400, "You already reviewed this product");

    const review = await Review.create({
        userId: req.user._id, productId, rating: Number(rating),
        title: title || "", body: body || "",
    });

    const populated = await Review.findById(review._id).populate("userId", "name avatar");
    return res.status(201).json(new apiResponse(201, populated, "Review added"));
});

const deleteReview = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id);
    if (!review) throw new apiError(404, "Review not found");
    // user can delete own, admin can delete any
    if (review.userId.toString() !== req.user._id.toString() && req.user.role !== "ADMIN") {
        throw new apiError(403, "Not authorized");
    }
    await Review.findByIdAndDelete(req.params.id);
    return res.status(200).json(new apiResponse(200, {}, "Review deleted"));
});

const getAllReviews = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const total = await Review.countDocuments();
    const reviews = await Review.find()
        .populate("userId", "name email avatar")
        .populate("productId", "name image price")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));
    return res.status(200).json(new apiResponse(200, {
        data: reviews, total, page: Number(page), totalPages: Math.ceil(total / limit),
    }, "All reviews fetched"));
});

export { getProductReviews, createReview, deleteReview, getAllReviews };
