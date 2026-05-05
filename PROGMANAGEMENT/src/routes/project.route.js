import { Router } from "express";
import { getProjects, getProjectById, createProject, updateProject, deleteProject, getProjectMembers, addMemberToProject, updateMemberRole, deleteMember } from "../controllers/project.controllers.js";
import { validate } from "../middlewares/validator.middleware.js"
import { addMemberToProjectValidator, creatProjectValidator } from "../validators/index.js"
import { verifyJWT, validateProjectPermision } from "../middlewares/auth.middelware.js";
import { AvailabelRole, UserRolesEnum } from "../utils/constants.js";

const router = Router()

router.use(verifyJWT)

router
    .route("/")
    .get(getProjects)
    .post(creatProjectValidator(), validate, createProject)

router
    .route("/:projectId")
    .get(validateProjectPermision(AvailabelRole), validate, getProjectById)
    .put(validateProjectPermision([UserRolesEnum.ADMIN]),
        creatProjectValidator(), validate, updateProject)
    .delete(
        validateProjectPermision([UserRolesEnum.ADMIN]),
        deleteProject)

router
    .route("/:projectId/members")
    .get(getProjectMembers)
    .post(
        validateProjectPermision([UserRolesEnum.ADMIN]),
        addMemberToProjectValidator(), validate, addMemberToProject
    )

router
    .route("/:projectId/members/:userId")
    .put(validateProjectPermision([UserRolesEnum.ADMIN]), updateMemberRole)
    .delete(validateProjectPermision([UserRolesEnum.ADMIN]), deleteMember)

export default router