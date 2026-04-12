import { Contact } from "../models/contact.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

const submitContact = asyncHandler(async (req, res) => {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) throw new apiError(400, "Name, email, and message are required");

    const contact = await Contact.create({ name, email, phone: phone || "", message });
    return res.status(201).json(new apiResponse(201, contact, "Message sent successfully"));
});

const getAllContacts = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, read } = req.query;
    const filter = {};
    if (read === "true") filter.read = true;
    if (read === "false") filter.read = false;

    const total = await Contact.countDocuments(filter);
    const contacts = await Contact.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

    return res.status(200).json(new apiResponse(200, {
        data: contacts, total, page: Number(page), totalPages: Math.ceil(total / limit),
    }, "Contacts fetched"));
});

const toggleRead = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) throw new apiError(404, "Contact not found");
    contact.read = !contact.read;
    await contact.save();
    return res.status(200).json(new apiResponse(200, contact, "Updated"));
});

const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) throw new apiError(404, "Contact not found");
    await Contact.findByIdAndDelete(req.params.id);
    return res.status(200).json(new apiResponse(200, {}, "Contact deleted"));
});

export { submitContact, getAllContacts, toggleRead, deleteContact };
