    import { Router } from "express";
import { createProjectnote, getProjectNotes, getNotebyId, updateProjectNote, deleteProjectNote } from "../controllers/note.controllers.js";
import { validate } from "../middlewares/validator.middleware.js"
import { createNoteValidator } from "../validators/index.js"
import { verifyJWT, validateProjectPermision } from "../middlewares/auth.middelware.js";
import { AvailabelRole, UserRolesEnum } from "../utils/constants.js";

const router = Router()

router.use(verifyJWT)

router
    .route("/:projectId")
    .get(validateProjectPermision(AvailabelRole), getProjectNotes)
    .post(validateProjectPermision([UserRolesEnum.ADMIN]),createNoteValidator(), validate, createProjectnote)

router
    .route("/:projectId/n/:noteId")
    .get(validateProjectPermision(AvailabelRole),getNotebyId)
    .put(validateProjectPermision([UserRolesEnum.ADMIN]),createNoteValidator(),validate, updateProjectNote)
    .delete(validateProjectPermision([UserRolesEnum.ADMIN]),deleteProjectNote)

export default router