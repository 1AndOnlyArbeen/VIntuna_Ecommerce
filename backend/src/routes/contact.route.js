import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.js";
import { verifyAdmin } from "../middlewares/admin.js";
import { submitContact, getAllContacts, toggleRead, deleteContact } from "../controllers/contact.controller.js";

const contactRouter = Router();

contactRouter.post("/", submitContact);
contactRouter.get("/", verifyJWT, verifyAdmin, getAllContacts);
contactRouter.patch("/:id/read", verifyJWT, verifyAdmin, toggleRead);
contactRouter.delete("/:id", verifyJWT, verifyAdmin, deleteContact);

export { contactRouter };
