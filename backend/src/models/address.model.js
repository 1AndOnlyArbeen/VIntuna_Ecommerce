import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    fullName: {
        type: String,
        default: "",
    },
    phone: {
        type: String,
        default: "",
    },
    street: {
        type: String,
        default: "",
    },
    city: {
        type: String,
        default: "",
    },
    landmark: {
        type: String,
        default: "",
    },
    label: {
        type: String,
        enum: ["home", "work", "other"],
        default: "home",
    },
    status: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

export const Address = mongoose.model("Address", addressSchema);