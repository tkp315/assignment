// create-task
// update -task
// get tasks of user
// get task
// search
// filter-tasks
// delete
// change-status

import { Router } from "express";
import verifyAuth from "../middlewares/verifyAuth.middleware.ts";
import { createTask, deleteTask, getTask, getTasks, updateTask } from "../controllers/task.controller.ts";

const taskRouter = Router();

taskRouter.route("/add").post(verifyAuth,createTask)
taskRouter.route("/tasks").get(verifyAuth,getTasks)
taskRouter.route("/:id").get(verifyAuth,getTask)
taskRouter.route("/:id").delete(verifyAuth,deleteTask)
taskRouter.route("/:id/toggle").patch(verifyAuth,updateTask)


export default taskRouter;
