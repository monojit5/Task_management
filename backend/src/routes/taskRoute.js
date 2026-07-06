import express from "express";
import userVerify from "../middleware/userMiddleware.js";
import { countData, createTask, filterDataShow, removedData, showData, showidData, updateData } from "../controllers/taskController.js";
const taskRoute = express.Router()
taskRoute.post("/task", userVerify, createTask);
taskRoute.get("/task", userVerify, showData );
taskRoute.get("/task/count", userVerify, countData )
taskRoute.get("/task/filter", userVerify, filterDataShow )
taskRoute.get("/task/:id", userVerify, showidData );
taskRoute.patch("/task/update/:id", userVerify, updateData )
taskRoute.delete("/task/delete/:id", userVerify, removedData )

export default taskRoute;