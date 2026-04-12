import { apiError } from "../utils/apiError.js";

const verifyAdmin = (req, res, next) => {
    if (req.user?.role !== "ADMIN") {
        throw new apiError(403, "Access denied. Admin only.");
    }
    next();
};

export { verifyAdmin };
