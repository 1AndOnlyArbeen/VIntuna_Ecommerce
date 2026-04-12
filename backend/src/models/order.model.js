import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: { type: String },
    image: { type: String },
    price: { type: Number },
    quantity: { type: Number },
}, { _id: false });

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    orderId: {
        type: String,
        required: [true, "provide orderId"],
        unique: true,
    },
    items: {
        type: [orderItemSchema],
        default: [],
    },
    deliveryAddress: {
        fullName: String,
        phone: String,
        street: String,
        city: String,
        landmark: String,
        label: String,
    },
    paymentMethod: {
        type: String,
        enum: ["cod"],
        default: "cod",
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid"],
        default: "pending",
    },
    status: {
        type: String,
        enum: ["pending", "warehouse", "delivering", "delivered", "cancelled"],
        default: "pending",
    },
    subtotal: {
        type: Number,
        default: 0,
    },
    deliveryFee: {
        type: Number,
        default: 0,
    },
    totalAmount: {
        type: Number,
        default: 0,
    },
    couponCode: {
        type: String,
        default: "",
    },
}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema);