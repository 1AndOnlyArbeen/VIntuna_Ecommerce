import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.js";
import { verifyAdmin } from "../middlewares/admin.js";
import { getProductReviews, createReview, deleteReview, getAllReviews } from "../controllers/review.controller.js";

const reviewRouter = Router();

reviewRouter.get("/product/:productId", getProductReviews);
reviewRouter.post("/", verifyJWT, createReview);
reviewRouter.delete("/:id", verifyJWT, deleteReview);
reviewRouter.get("/admin/all", verifyJWT, verifyAdmin, getAllReviews);

export { reviewRouter };
