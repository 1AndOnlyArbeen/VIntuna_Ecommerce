import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.js";
import { verifyAdmin } from "../middlewares/admin.js";
import {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
} from "../controllers/order.controller.js";

const orderRouter = Router();

orderRouter.use(verifyJWT);

orderRouter.post("/", createOrder);
orderRouter.get("/", getOrders);
orderRouter.get("/:id", getOrderById);
orderRouter.put("/:id/status", verifyAdmin, updateOrderStatus);

export { orderRouter };
