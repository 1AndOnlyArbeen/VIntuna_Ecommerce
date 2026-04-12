import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

// ──────────────────────────────────────────────
// HOW THIS WORKS:
//
// 1. Customer sends a message like "show me spices under Rs.200"
// 2. We search MongoDB for products matching keywords
// 3. We fetch all category names
// 4. We build a system prompt with REAL product data
// 5. We send everything to DeepSeek R1 running locally via Ollama
// 6. DeepSeek generates a response using real data
// 7. We return the response to frontend
//
// Ollama runs at http://localhost:11434 — no API key needed,
// completely free, unlimited, runs on your machine.
// ──────────────────────────────────────────────

const OLLAMA_URL = "http://localhost:11434/api/chat";
const MODEL = "deepseek-r1:7b";

const sendMessage = asyncHandler(async (req, res) => {
    const { message, history = [] } = req.body;

    if (!message || !message.trim()) {
        throw new apiError(400, "Message is required");
    }

    // ── STEP 1: Search products related to the customer's message ──
    const searchWords = message
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .split(/\s+/)
        .filter(w => w.length > 2);

    let matchedProducts = [];

    if (searchWords.length > 0) {
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
            .limit(15)
            .lean();
    }

    if (matchedProducts.length === 0) {
        matchedProducts = await Product.find({ inStock: true })
            .select("name price category description tags")
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();
    }

    // ── STEP 2: Get all categories ──
    const categories = await Category.find().select("name").lean();
    const categoryNames = categories.map(c => c.name).join(", ");

    // ── STEP 3: Format product data as text ──
    const productContext = matchedProducts
        .map(p => {
            let line = `- ${p.name} | Rs.${p.price}`;
            if (p.originalPrice > p.price) line += ` (was Rs.${p.originalPrice})`;
            line += ` | Category: ${p.category}`;
            if (!p.inStock) line += " | OUT OF STOCK";
            if (p.tags?.length) line += ` | Tags: ${p.tags.join(", ")}`;
            return line;
        })
        .join("\n");

    // ── STEP 4: Build the system prompt ──
    const systemPrompt = `You are VintunaStore's friendly shopping assistant. VintunaStore is a grocery store in Kathmandu, Nepal.

RULES:
- Be helpful, friendly, concise (2-3 sentences max unless listing products)
- Only recommend products from the data below — NEVER make up products
- Show prices in Rs. (Nepali Rupees)
- If a product is out of stock, mention it
- If asked about something not in the store, say we don't have it yet
- Delivery is in Kathmandu, free above Rs.200, payment is Cash on Delivery only
- Keep responses short and natural
- Do NOT include any thinking tags or internal reasoning in your response

OUR CATEGORIES: ${categoryNames || "Various grocery items"}

MATCHING PRODUCTS:
${productContext || "No specific matches found."}`;

    // ── STEP 5: Build conversation messages for Ollama ──
    const messages = [
        { role: "system", content: systemPrompt },
        ...history.map(msg => ({
            role: msg.role === "user" ? "user" : "assistant",
            content: msg.text,
        })),
        { role: "user", content: message },
    ];

    // ── STEP 6: Call Ollama (DeepSeek R1 locally) ──
    let reply = "";
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 60000); // 60s timeout

        const ollamaRes = await fetch(OLLAMA_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: MODEL,
                messages,
                stream: false,
            }),
            signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!ollamaRes.ok) {
            throw new Error(`Ollama returned ${ollamaRes.status}`);
        }

        const data = await ollamaRes.json();
        reply = data.message?.content || "";

        // Clean up DeepSeek's thinking tags if present
        reply = reply.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

        if (!reply) {
            reply = "Sorry, I couldn't generate a response. Please try again!";
        }
    } catch (err) {
        if (err.name === "AbortError") {
            throw new apiError(504, "AI took too long to respond. Try a shorter question.");
        }
        throw new apiError(503, "AI service is not available. Make sure Ollama is running (ollama serve).");
    }

    // ── STEP 7: Return response ──
    return res.status(200).json(
        new apiResponse(200, {
            reply,
            productsFound: matchedProducts.length,
        }, "Chat response")
    );
});

export { sendMessage };
