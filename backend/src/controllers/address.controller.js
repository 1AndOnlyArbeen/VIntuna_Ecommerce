import { Address } from "../models/address.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

const getAddresses = asyncHandler(async (req, res) => {
    const addresses = await Address.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json(new apiResponse(200, addresses, "Addresses fetched successfully"));
});

const createAddress = asyncHandler(async (req, res) => {
    const { fullName, phone, street, city, landmark, label } = req.body;

    if (!fullName || !phone || !street || !city) {
        throw new apiError(400, "Full name, phone, street, and city are required");
    }

    const address = await Address.create({
        userId: req.user._id,
        fullName,
        phone,
        street,
        city,
        landmark: landmark || "",
        label: label || "home",
    });

    return res.status(201).json(new apiResponse(201, address, "Address created successfully"));
});

const updateAddress = asyncHandler(async (req, res) => {
    const address = await Address.findOne({ _id: req.params.id, userId: req.user._id });
    if (!address) throw new apiError(404, "Address not found");

    const { fullName, phone, street, city, landmark, label } = req.body;

    const updated = await Address.findByIdAndUpdate(
        req.params.id,
        {
            fullName: fullName || address.fullName,
            phone: phone || address.phone,
            street: street || address.street,
            city: city || address.city,
            landmark: landmark !== undefined ? landmark : address.landmark,
            label: label || address.label,
        },
        { new: true }
    );

    return res.status(200).json(new apiResponse(200, updated, "Address updated successfully"));
});

const deleteAddress = asyncHandler(async (req, res) => {
    const address = await Address.findOne({ _id: req.params.id, userId: req.user._id });
    if (!address) throw new apiError(404, "Address not found");

    await Address.findByIdAndDelete(req.params.id);
    return res.status(200).json(new apiResponse(200, {}, "Address deleted successfully"));
});

export { getAddresses, createAddress, updateAddress, deleteAddress };
