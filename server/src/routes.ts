import { Router } from "express";
import { TaskController } from "./controllers/TaskController";

const router = Router();

const createTask = new TaskController();

router.post('/task', createTask.create);

export { router };