import express from "express";
import { protect, requireAdmin } from "../middleware/auth.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

const populateTask = [
  { path: "project", select: "name members" },
  { path: "assignedTo", select: "name email role" },
  { path: "createdBy", select: "name email role" },
];

async function ensureProjectAccess(projectId, user) {
  const project = await Project.findById(projectId);

  if (!project) {
    const error = new Error("Project not found");
    error.statusCode = 404;
    throw error;
  }

  const isMember = project.members.some((id) => id.toString() === user._id.toString());
  if (user.role !== "admin" && !isMember) {
    const error = new Error("You do not have access to this project");
    error.statusCode = 403;
    throw error;
  }

  return project;
}

router.get(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const { status, project } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (project) filter.project = project;

    if (req.user.role !== "admin") {
      filter.assignedTo = req.user._id;
    }

    const tasks = await Task.find(filter).populate(populateTask).sort({ dueDate: 1 });
    res.json(tasks);
  })
);

router.post(
  "/",
  protect,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { title, description = "", project, assignedTo, status = "pending", priority = "medium", dueDate } = req.body;

    if (!title || !project || !assignedTo || !dueDate) {
      res.status(400);
      throw new Error("Title, project, assignee, and due date are required");
    }

    const projectDoc = await ensureProjectAccess(project, req.user);
    const isAssignedMember = projectDoc.members.some((id) => id.toString() === assignedTo);

    if (!isAssignedMember) {
      projectDoc.members.push(assignedTo);
      await projectDoc.save();
    }

    const task = await Task.create({
      title,
      description,
      project,
      assignedTo,
      createdBy: req.user._id,
      status,
      priority,
      dueDate,
    });

    const populated = await task.populate(populateTask);
    res.status(201).json(populated);
  })
);

router.patch(
  "/:id/status",
  protect,
  asyncHandler(async (req, res) => {
    const { status } = req.body;
    const allowed = ["pending", "in-progress", "done"];

    if (!allowed.includes(status)) {
      res.status(400);
      throw new Error("Invalid task status");
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    const isAssignee = task.assignedTo.toString() === req.user._id.toString();
    if (req.user.role !== "admin" && !isAssignee) {
      res.status(403);
      throw new Error("You can only update your assigned tasks");
    }

    task.status = status;
    await task.save();
    const populated = await task.populate(populateTask);
    res.json(populated);
  })
);

router.put(
  "/:id",
  protect,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    const { title, description, project, assignedTo, status, priority, dueDate } = req.body;
    const projectId = project || task.project;
    const projectDoc = await ensureProjectAccess(projectId, req.user);

    if (assignedTo) {
      const isAssignedMember = projectDoc.members.some((id) => id.toString() === assignedTo);
      if (!isAssignedMember) {
        projectDoc.members.push(assignedTo);
        await projectDoc.save();
      }
    }

    task.title = title || task.title;
    task.description = description ?? task.description;
    task.project = project || task.project;
    task.assignedTo = assignedTo || task.assignedTo;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.dueDate = dueDate || task.dueDate;

    await task.save();
    const populated = await task.populate(populateTask);
    res.json(populated);
  })
);

router.delete(
  "/:id",
  protect,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    await task.deleteOne();
    res.json({ message: "Task deleted" });
  })
);

export default router;
