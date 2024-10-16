import express from "express";
import authenticateToken from "../utils.js";
import { addTask, deleteTask, editTask, getTaskById, getTasks, SearchTask, updateIsPinned } from "../controllers/userController.js";

const router = express.Router();

router.post("/add-task", authenticateToken, addTask);
router.put("/edit-task/:taskId",authenticateToken,editTask);
router.get("/get-all-task",authenticateToken,getTasks);
router.get("/get-task/:taskId",authenticateToken,getTaskById);
router.delete("/delete-task/:taskId", authenticateToken, deleteTask);
router.put("/isPinned/:taskId",authenticateToken, updateIsPinned);
router.get("/search-tasks",authenticateToken,SearchTask)

export default router;
