import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        default: "",
    },
    image: {
        type: String,
        default: "",
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
}, { timestamps: true });

export const SubCategory = mongoose.model("SubCategory", subCategorySchema);