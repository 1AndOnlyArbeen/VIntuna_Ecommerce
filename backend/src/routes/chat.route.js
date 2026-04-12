import { Router } from "express";
import { sendMessage } from "../controllers/chat.controller.js";

const chatRouter = Router();

// No auth required — guests can also chat
chatRouter.post("/", sendMessage);

export { chatRouter };
