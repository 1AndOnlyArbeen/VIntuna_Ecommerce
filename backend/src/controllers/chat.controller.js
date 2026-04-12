import { GoogleGenerativeAI } from "@google/generative-ai";
import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

// ──────────────────────────────────────────────
// HOW THIS WORKS (step by step):
//
// 1. Customer sends a message like "show me spices under Rs.200"
// 2. We search MongoDB for products matching keywords in their message
// 3. We also fetch all category names so the AI knows what's available
// 4. We build a SYSTEM PROMPT telling Gemini:
//    - "You are VintunaStore assistant"
//    - Here are the matching products from our database
//    - Here are our categories
// 5. We send the customer's message + context to Gemini API
// 6. Gemini generates a helpful response using REAL product data
// 7. We return the AI response to the frontend
//
// This means the AI never makes up fake products — it only
// talks about products that actually exist in your database.
// ──────────────────────────────────────────────

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const sendMessage = asyncHandler(async (req, res) => {
    const { message, history = [] } = req.body;

    if (!message || !message.trim()) {
        throw new apiError(400, "Message is required");
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_gemini_api_key_here") {
        throw new apiError(500, "Gemini API key not configured");
    }

    // ── STEP 1: Search products related to the customer's message ──
    // We extract the customer's words and search product names,
    // categories, and descriptions in MongoDB using regex
    const searchWords = message
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .split(/\s+/)
        .filter(w => w.length > 2); // ignore tiny words like "a", "is"

    let matchedProducts = [];

    if (searchWords.length > 0) {
        // Build a regex that matches ANY of the customer's words
        const regexPattern = searchWords.join("|");
        matchedProducts = await Product.find({
            $or: [
                { name: { $regex: regexPattern, $options: "i" } },
                { category: { $regex: regexPattern, $options: "i" } },
                { description: { $regex: regexPattern, $options: "i" } },
                { tags: { $regex: regexPattern, $options: "i" } },
            ],
        })
            .select("name price originalPrice category description inStock tags deliveryTime")
            .limit(15) // don't send too many — keeps API cost low
            .lean();
    }

    // If no keyword matches, grab some popular products as fallback
    if (matchedProducts.length === 0) {
        matchedProducts = await Product.find({ inStock: true })
            .select("name price category description tags")
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();
    }

    // ── STEP 2: Get all categories so AI knows the store structure ──
    const categories = await Category.find()
        .select("name")
        .lean();

    const categoryNames = categories.map(c => c.name).join(", ");

    // ── STEP 3: Format product data as text for the AI ──
    const productContext = matchedProducts
        .map(p => {
            let line = `- ${p.name} | Rs.${p.price}`;
            if (p.originalPrice > p.price) line += ` (was Rs.${p.originalPrice})`;
            line += ` | Category: ${p.category}`;
            if (!p.inStock) line += " | OUT OF STOCK";
            if (p.tags?.length) line += ` | Tags: ${p.tags.join(", ")}`;
            if (p.deliveryTime) line += ` | Delivery: ${p.deliveryTime}`;
            return line;
        })
        .join("\n");

    // ── STEP 4: Build the system prompt ──
    // This tells Gemini WHO it is and WHAT data it has
    const systemPrompt = `You are VintunaStore's friendly shopping assistant chatbot. VintunaStore is a grocery store in Kathmandu, Nepal selling Nepali food products.

RULES:
- Be helpful, friendly, and concise (2-3 sentences max unless listing products)
- Only recommend products from the data below — NEVER make up products
- Always show prices in Rs. (Nepali Rupees)
- If a product is out of stock, mention it
- If asked about something not in the store, politely say we don't have it yet
- For order/delivery questions: we deliver in Kathmandu, delivery is free above Rs.200, payment is Cash on Delivery only
- If customer wants to buy, tell them to add items to cart and checkout
- Keep responses short and natural, like a real shopkeeper

OUR CATEGORIES: ${categoryNames || "Various grocery items"}

MATCHING PRODUCTS FROM OUR DATABASE:
${productContext || "No specific matches found — suggest browsing our categories."}`;

    // ── STEP 5: Build conversation history for Gemini ──
    // We send previous messages so the AI remembers the conversation
    // Try gemini-2.0-flash first, fall back to gemini-2.0-flash-lite if rate limited
    const models = ["gemini-2.0-flash", "gemini-2.0-flash-lite"];
    let reply = "";

    for (const modelName of models) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });

            const chatHistory = history.map(msg => ({
                role: msg.role === "user" ? "user" : "model",
                parts: [{ text: msg.text }],
            }));

            const chat = model.startChat({
                history: chatHistory,
                systemInstruction: systemPrompt,
            });

            const result = await chat.sendMessage(message);
            reply = result.response.text();
            break; // success — stop trying other models
        } catch (err) {
            if (err.message?.includes("429") && modelName !== models[models.length - 1]) {
                continue; // rate limited — try next model
            }
            if (err.message?.includes("429")) {
                throw new apiError(429, "AI is busy right now. Please try again in a minute.");
            }
            throw err;
        }
    }

    // ── STEP 7: Return the AI response ──
    return res.status(200).json(
        new apiResponse(200, {
            reply,
            productsFound: matchedProducts.length,
        }, "Chat response")
    );
});

export { sendMessage };
