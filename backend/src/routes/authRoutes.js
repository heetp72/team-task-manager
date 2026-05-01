import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

function createToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

function publicUser(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { name, email, password, role = "member" } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Name, email, and password are required");
    }

    if (password.length < 6) {
      res.status(400);
      throw new Error("Password must be at least 6 characters");
    }

    const existing = await User.findOne({ email });
    if (existing) {
      res.status(409);
      throw new Error("Email is already registered");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: passwordHash,
      role: role === "admin" ? "admin" : "member",
    });

    res.status(201).json({
      token: createToken(user),
      user: publicUser(user),
    });
  })
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Email and password are required");
    }

    const user = await User.findOne({ email });
    const matches = user ? await bcrypt.compare(password, user.password) : false;

    if (!matches) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    res.json({
      token: createToken(user),
      user: publicUser(user),
    });
  })
);

router.get(
  "/me",
  protect,
  asyncHandler(async (req, res) => {
    res.json(publicUser(req.user));
  })
);

export default router;
