import { body } from "express-validator"
import { AvailabelRole, AvailabelTaskStatusEnum } from "../utils/constants.js"

const userRegisterValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required!")
            .isEmail()
            .withMessage("Email is invalid"),
        body("username")
            .trim()
            .notEmpty()
            .withMessage("Username is required!")
            .isLowercase()
            .withMessage("Username must be in lower csae")
            .isLength({ min: 3 })
            .withMessage("Username must be at least 3 characters long"),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("Password is required")
            .isLength({ min: 8 })
            .withMessage("Password must be atleast 8 characters long"),
        body("fullname").optional().trim()
    ]
}

const userLoginValidator = () => {
    return [
        body("email")
            .optional()
            .isEmail()
            .withMessage("Email is Invalid !"),
        body("password")
            .notEmpty()
            .withMessage("Password is required !")
    ]
}

const userChangeCurrentPasswordValidator = () => {
    return [
        body("oldPassword").notEmpty().withMessage("Old Password is required"),
        body("newPassword").notEmpty().withMessage("New Password is required")
    ]
}

const userForgotPasswordValidator = () => {
    return [
        body("email").trim()
            .notEmpty().withMessage("Email is required")
            .isEmail().withMessage("Email is Invalid")
    ]
}

const userResetForgotPassword = () => {
    return [
        body("newPassword").trim()
            .notEmpty().withMessage("New Password is required")
    ]
}

const creatProjectValidator = () => {
    return [
        body("name")
            .notEmpty()
            .withMessage("Name is required"),
        body("description")
            .optional()
    ]
}

const addMemberToProjectValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Invalid Email"),
        body("role")
            .trim()
            .notEmpty()
            .withMessage("Role is required")
            .isIn(AvailabelRole)
            .withMessage("Role is Invalid")
    ]
}

//task validators
const createTaskValidator = () => {
    return [
        body("title")
            .trim()
            .notEmpty()
            .withMessage("Title is requires"),
        body("description")
            .trim()
            .notEmpty()
            .withMessage("Description is required"),
        body("status")
            .trim()
            .notEmpty()
            .withMessage("Status is required")
            .isIn(AvailabelTaskStatusEnum)
            .withMessage("Status is Invalid")
    ]
}

const createSubtaskValidator = () => {
    return [
        body("title")
            .trim()
            .notEmpty()
            .withMessage("Title is required")
    ]
}

const createNoteValidator= () => {
    return [
        body("content")
        .trim()
        .notEmpty()
        .withMessage("Note Content is required")
    ]
}

export {
    userRegisterValidator,
    userLoginValidator,
    userChangeCurrentPasswordValidator,
    userForgotPasswordValidator,
    userResetForgotPassword,
    creatProjectValidator,
    addMemberToProjectValidator,
    createTaskValidator,
    createSubtaskValidator,
    createNoteValidator
}