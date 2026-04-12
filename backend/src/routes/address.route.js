import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.js";
import {
    getAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
} from "../controllers/address.controller.js";

const addressRouter = Router();

addressRouter.use(verifyJWT);

addressRouter.get("/", getAddresses);
addressRouter.post("/", createAddress);
addressRouter.put("/:id", updateAddress);
addressRouter.delete("/:id", deleteAddress);

export { addressRouter };
