import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.js";
import { verifyAdmin } from "../middlewares/admin.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
    getProducts, getProductById, searchProducts,
    createProduct, updateProduct, deleteProduct, toggleFeatured,
} from "../controllers/product.controller.js";

const productRouter = Router();

productRouter.get("/", getProducts);
productRouter.get("/search", searchProducts);
productRouter.get("/:id", getProductById);
productRouter.post("/", verifyJWT, verifyAdmin, upload.array("images", 10), createProduct);
productRouter.put("/:id", verifyJWT, verifyAdmin, upload.array("images", 10), updateProduct);
productRouter.patch("/:id/featured", verifyJWT, verifyAdmin, toggleFeatured);
productRouter.delete("/:id", verifyJWT, verifyAdmin, deleteProduct);

export { productRouter };
