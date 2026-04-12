import { Order } from "../models/order.model.js";
import { Discount } from "../models/discount.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

const createOrder = asyncHandler(async (req, res) => {
    const { items, deliveryAddress, subtotal, deliveryFee, totalAmount, couponCode } = req.body;

    if (!items || items.length === 0) {
        throw new apiError(400, "Order must have at least one item");
    }
    if (!deliveryAddress || !deliveryAddress.fullName || !deliveryAddress.street || !deliveryAddress.city) {
        throw new apiError(400, "Delivery address is required");
    }

    // If coupon code was applied, increment its used count
    let appliedCoupon = null;
    if (couponCode) {
        const discount = await Discount.findOne({ code: couponCode.toUpperCase(), active: true });
        if (discount && discount.used < discount.usageLimit) {
            discount.used += 1;
            await discount.save();
            appliedCoupon = discount.code;
        }
    }

    const orderId = "VNT-" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();

    const order = await Order.create({
        userId: req.user._id,
        orderId,
        items,
        deliveryAddress,
        paymentMethod: "cod",
        paymentStatus: "pending",
        status: "pending",
        subtotal: Number(subtotal || 0),
        deliveryFee: Number(deliveryFee || 0),
        totalAmount: Number(totalAmount || 0),
        couponCode: appliedCoupon || "",
    });

    return res.status(201).json(new apiResponse(201, order, "Order placed successfully"));
});

const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json(new apiResponse(200, orders, "Orders fetched successfully"));
});

const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user._id });
    if (!order) throw new apiError(404, "Order not found");
    return res.status(200).json(new apiResponse(200, order, "Order fetched successfully"));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const validStatuses = ["pending", "warehouse", "delivering", "delivered", "cancelled"];

    if (!status || !validStatuses.includes(status)) {
        throw new apiError(400, "Valid status is required");
    }

    const order = await Order.findById(req.params.id);
    if (!order) throw new apiError(404, "Order not found");

    order.status = status;
    if (status === "delivered") order.paymentStatus = "paid";
    await order.save();

    return res.status(200).json(new apiResponse(200, order, "Order status updated"));
});

export { createOrder, getOrders, getOrderById, updateOrderStatus };
