import { CartProduct } from "../models/cartProduct.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

const getCart = asyncHandler(async (req, res) => {
    const cartItems = await CartProduct.find({ userId: req.user._id }).populate("productId");
    return res.status(200).json(new apiResponse(200, cartItems, "Cart fetched successfully"));
});

const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity = 1 } = req.body;
    if (!productId) throw new apiError(400, "Product ID is required");

    const existing = await CartProduct.findOne({ userId: req.user._id, productId });

    if (existing) {
        existing.quantity += Number(quantity);
        await existing.save();
        return res.status(200).json(new apiResponse(200, existing, "Cart updated"));
    }

    const cartItem = await CartProduct.create({
        userId: req.user._id,
        productId,
        quantity: Number(quantity),
    });

    return res.status(201).json(new apiResponse(201, cartItem, "Added to cart"));
});

const updateCartItem = asyncHandler(async (req, res) => {
    const { quantity } = req.body;
    if (!quantity || quantity < 1) throw new apiError(400, "Valid quantity is required");

    const cartItem = await CartProduct.findOneAndUpdate(
        { userId: req.user._id, productId: req.params.productId },
        { quantity: Number(quantity) },
        { new: true }
    );

    if (!cartItem) throw new apiError(404, "Cart item not found");

    return res.status(200).json(new apiResponse(200, cartItem, "Cart item updated"));
});

const removeFromCart = asyncHandler(async (req, res) => {
    const result = await CartProduct.findOneAndDelete({
        userId: req.user._id,
        productId: req.params.productId,
    });

    if (!result) throw new apiError(404, "Cart item not found");

    return res.status(200).json(new apiResponse(200, {}, "Removed from cart"));
});

const clearCart = asyncHandler(async (req, res) => {
    await CartProduct.deleteMany({ userId: req.user._id });
    return res.status(200).json(new apiResponse(200, {}, "Cart cleared"));
});

export { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
