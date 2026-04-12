import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
    },
    image: {
        type: Array,
        default: [],
    },
    category: {
        type: String,
        default: "",
    },
    unit: {
        type: String,
        default: "",
    },
    stock: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        default: 0,
    },
    originalPrice: {
        type: Number,
        default: 0,
    },
    discount: {
        type: Number,
        default: 0,
    },
    description: {
        type: String,
        default: "",
    },
    tags: {
        type: [String],
        default: [],
    },
    inStock: {
        type: Boolean,
        default: true,
    },
    deliveryTime: {
        type: String,
        default: "",
    },
    featured: {
        type: Boolean,
        default: false,
    },
    publish: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

export const Product = mongoose.model("Product", productSchema);