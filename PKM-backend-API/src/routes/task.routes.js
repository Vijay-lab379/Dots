import { Router } from "express";
import { getTasks, createTask, getTaskById, updateTask, deleteTask, createSubtask, updateSubtask,deleteSubtask } from "../controllers/task.controllers.js";
import { validate } from "../middlewares/validator.middleware.js"
import { createTaskValidator,createSubtaskValidator } from "../validators/index.js"
import { verifyJWT, validateProjectPermision } from "../middlewares/auth.middelware.js";
import { AvailabelRole, UserRolesEnum } from "../utils/constants.js";

const router = Router()

router.use(verifyJWT)

router
    .route("/:projectId")
    .get(validateProjectPermision(AvailabelRole),getTasks)
    .post(validateProjectPermision([UserRolesEnum.ADMIN,UserRolesEnum.PROJECT_ADMIN]),createTaskValidator(), validate, createTask)

router
    .route("/:projectId/t/:taskId")
    .get(validateProjectPermision(AvailabelRole),getTaskById)
    .post(validateProjectPermision([UserRolesEnum.ADMIN,UserRolesEnum.PROJECT_ADMIN]),createTaskValidator(), validate,updateTask)
    .delete(validateProjectPermision([UserRolesEnum.ADMIN,UserRolesEnum.PROJECT_ADMIN]),deleteTask)

router
    .route("/:projectId/t/:taskId/subtasks")
    .post(validateProjectPermision([UserRolesEnum.ADMIN,UserRolesEnum.PROJECT_ADMIN]),createSubtaskValidator(), validate, createSubtask)

router
    .route("/:projectId/st/:subTaskId")
    .post(validateProjectPermision(AvailabelRole),createSubtaskValidator(), validate, updateSubtask)
    .delete(validateProjectPermision([UserRolesEnum.ADMIN,UserRolesEnum.PROJECT_ADMIN]),deleteSubtask)


export default router