import express from "express";
import { protect, requireAdmin } from "../middleware/auth.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

const populateProject = [
  { path: "owner", select: "name email role" },
  { path: "members", select: "name email role" },
];

router.get(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const filter =
      req.user.role === "admin"
        ? {}
        : { $or: [{ owner: req.user._id }, { members: req.user._id }] };

    const projects = await Project.find(filter).populate(populateProject).sort({ createdAt: -1 });
    res.json(projects);
  })
);

router.post(
  "/",
  protect,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { name, description = "", members = [] } = req.body;

    if (!name || name.trim().length < 3) {
      res.status(400);
      throw new Error("Project name must be at least 3 characters");
    }

    const validMembers = await User.find({ _id: { $in: members } }).select("_id");
    const memberIds = [...new Set([req.user._id.toString(), ...validMembers.map((m) => m._id.toString())])];

    const project = await Project.create({
      name,
      description,
      owner: req.user._id,
      members: memberIds,
    });

    const populated = await project.populate(populateProject);
    res.status(201).json(populated);
  })
);

router.put(
  "/:id",
  protect,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { name, description = "", members = [] } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    const validMembers = await User.find({ _id: { $in: members } }).select("_id");
    project.name = name || project.name;
    project.description = description;
    project.members = [...new Set([project.owner.toString(), ...validMembers.map((m) => m._id.toString())])];

    await project.save();
    const populated = await project.populate(populateProject);
    res.json(populated);
  })
);

router.delete(
  "/:id",
  protect,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    await Task.deleteMany({ project: project._id });
    await project.deleteOne();
    res.json({ message: "Project and related tasks deleted" });
  })
);

export default router;
