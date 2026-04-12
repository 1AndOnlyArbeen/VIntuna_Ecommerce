import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.js";
import { verifyAdmin } from "../middlewares/admin.js";
import { getDashboardStats, getAllOrders } from "../controllers/admin.controller.js";
import { updateOrderStatus } from "../controllers/order.controller.js";

const adminRouter = Router();

adminRouter.use(verifyJWT, verifyAdmin);

adminRouter.get("/stats", getDashboardStats);
adminRouter.get("/orders", getAllOrders);
adminRouter.put("/orders/:id/status", updateOrderStatus);

export { adminRouter };
