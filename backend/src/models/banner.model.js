import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    buttonText: { type: String, default: "Shop Now" },
    link: { type: String, default: "/" },
    image: { type: String, default: "" },
    active: { type: Boolean, default: true },
}, { timestamps: true });

export const Banner = mongoose.model("Banner", bannerSchema);
