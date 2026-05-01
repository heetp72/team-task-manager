import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : req.headers.token;

  if (!token) {
    res.status(401);
    throw new Error("Authentication required");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select("-password");

  if (!user) {
    res.status(401);
    throw new Error("Invalid token");
  }

  req.user = user;
  next();
});

export function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    res.status(403);
    throw new Error("Admin access required");
  }

  next();
}
