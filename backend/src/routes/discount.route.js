import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.js";
import { verifyAdmin } from "../middlewares/admin.js";
import {
    getDiscounts, createDiscount, updateDiscount, toggleDiscountActive, deleteDiscount, validateDiscount,
} from "../controllers/discount.controller.js";

const discountRouter = Router();

// Customer can validate a coupon code
discountRouter.post("/validate", verifyJWT, validateDiscount);

// Admin CRUD
discountRouter.get("/", verifyJWT, verifyAdmin, getDiscounts);
discountRouter.post("/", verifyJWT, verifyAdmin, createDiscount);
discountRouter.put("/:id", verifyJWT, verifyAdmin, updateDiscount);
discountRouter.patch("/:id/toggle", verifyJWT, verifyAdmin, toggleDiscountActive);
discountRouter.delete("/:id", verifyJWT, verifyAdmin, deleteDiscount);

export { discountRouter };
