import mongoose from "mongoose";

const discountSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, uppercase: true },
    discount: { type: Number, required: true },
    type: { type: String, enum: ["percent", "flat"], default: "percent" },
    minOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    usageLimit: { type: Number, default: 100 },
    used: { type: Number, default: 0 },
}, { timestamps: true });

export const Discount = mongoose.model("Discount", discountSchema);
