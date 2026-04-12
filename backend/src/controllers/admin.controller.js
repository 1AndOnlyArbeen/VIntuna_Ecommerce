import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";
import { Banner } from "../models/banner.model.js";
import { Discount } from "../models/discount.model.js";
import { Review } from "../models/review.model.js";
import { Contact } from "../models/contact.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";

const getDashboardStats = asyncHandler(async (req, res) => {
    const [totalProducts, totalCategories, totalOrders, totalUsers, totalBanners, totalDiscounts, totalReviews, totalContacts, unreadContacts] = await Promise.all([
        Product.countDocuments(),
        Category.countDocuments(),
        Order.countDocuments(),
        User.countDocuments(),
        Banner.countDocuments(),
        Discount.countDocuments(),
        Review.countDocuments(),
        Contact.countDocuments(),
        Contact.countDocuments({ read: false }),
    ]);

    const inStock = await Product.countDocuments({ inStock: true });
    const outOfStock = totalProducts - inStock;
    const featuredCount = await Product.countDocuments({ featured: true });
    const activeBanners = await Banner.countDocuments({ active: true });
    const activeDiscounts = await Discount.countDocuments({ active: true });

    const pendingOrders = await Order.countDocuments({ status: "pending" });
    const deliveringOrders = await Order.countDocuments({ status: "delivering" });
    const deliveredOrders = await Order.countDocuments({ status: "delivered" });

    const recentOrders = await Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("userId", "name email");

    return res.status(200).json(
        new apiResponse(200, {
            totalProducts, inStock, outOfStock, featuredCount,
            totalCategories, totalOrders, pendingOrders, deliveringOrders, deliveredOrders,
            totalUsers, totalBanners, activeBanners, totalDiscounts, activeDiscounts,
            totalReviews, totalContacts, unreadContacts, recentOrders,
        }, "Dashboard stats")
    );
});

const getAllOrders = asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .populate("userId", "name email");

    return res.status(200).json(
        new apiResponse(200, { data: orders, total, page: Number(page), totalPages: Math.ceil(total / limit) }, "Orders fetched")
    );
});

export { getDashboardStats, getAllOrders };
