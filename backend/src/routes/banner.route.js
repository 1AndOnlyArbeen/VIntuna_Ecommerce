import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.js";
import { verifyAdmin } from "../middlewares/admin.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
    getBanners, createBanner, updateBanner, toggleBannerActive, deleteBanner,
} from "../controllers/banner.controller.js";

const bannerRouter = Router();

bannerRouter.get("/", getBanners);
bannerRouter.post("/", verifyJWT, verifyAdmin, upload.single("image"), createBanner);
bannerRouter.put("/:id", verifyJWT, verifyAdmin, upload.single("image"), updateBanner);
bannerRouter.patch("/:id/toggle", verifyJWT, verifyAdmin, toggleBannerActive);
bannerRouter.delete("/:id", verifyJWT, verifyAdmin, deleteBanner);

export { bannerRouter };
