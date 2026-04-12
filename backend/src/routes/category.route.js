import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.js";
import { verifyAdmin } from "../middlewares/admin.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../controllers/category.controller.js";

const categoryRouter = Router();

categoryRouter.get("/", getCategories);
categoryRouter.get("/:id", getCategoryById);
categoryRouter.post("/", verifyJWT, verifyAdmin, upload.single("image"), createCategory);
categoryRouter.put("/:id", verifyJWT, verifyAdmin, upload.single("image"), updateCategory);
categoryRouter.delete("/:id", verifyJWT, verifyAdmin, deleteCategory);

export { categoryRouter };
