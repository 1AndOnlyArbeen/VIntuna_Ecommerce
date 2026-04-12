import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.js";
import {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
} from "../controllers/cartProduct.controller.js";

const cartRouter = Router();

cartRouter.use(verifyJWT);

cartRouter.get("/", getCart);
cartRouter.post("/", addToCart);
cartRouter.put("/:productId", updateCartItem);
cartRouter.delete("/clear", clearCart);
cartRouter.delete("/:productId", removeFromCart);

export { cartRouter };
