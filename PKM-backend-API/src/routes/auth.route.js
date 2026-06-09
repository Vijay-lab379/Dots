import { Router  } from "express";
import { loginUser, registerUser, logoutUser, verifyEmail, refreshAccessToken, forgotPasswordRequest, resetForgotPassword, getCurrentUser, changeCurrentPassword, resendEmailVerfication } from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validator.middleware.js"
import { userRegisterValidator , userLoginValidator, userForgotPasswordValidator, userResetForgotPassword, userChangeCurrentPasswordValidator} from "../validators/index.js"
import { verifyJWT } from "../middlewares/auth.middelware.js";

const router = Router()

//unsecure routes
router.route("/register").post(userRegisterValidator(), validate, registerUser)
router.route("/login").post(userLoginValidator(), validate, loginUser)
router.route("/verify-email/:verificationToken").get(verifyEmail)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/forgot-password").post(userForgotPasswordValidator(), validate, forgotPasswordRequest)
router.route("/reset-password/:resetToken").post(userResetForgotPassword(), validate, resetForgotPassword)

//secure routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/current-user").post(verifyJWT, getCurrentUser)
router.route("/change-password").post(verifyJWT, userChangeCurrentPasswordValidator(), validate, changeCurrentPassword)
router.route("/resend-email-verificataion").post(verifyJWT, resendEmailVerfication)
export default router
