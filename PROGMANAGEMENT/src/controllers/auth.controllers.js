import { User } from "../models/user.module.js"
import { ApiResponse } from "../utils/api-response.js"
import { ApiError } from "../utils/api-error.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { emailVerificationMailgenContent, forgotPasswordMailgenContent, sendEmail } from "../utils/mail.js"
import jwt from "jsonwebtoken"
import crypto, { hash } from "crypto"
// import { useReducer } from "react"

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        //false for not checking all the things

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(
            500,
            "Somthing went wrong while generating access tokens"
        )
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(408, "User with username or email already exists", [])
    }

    const user = await User.create({
        email,
        password,
        username,
        role,
        isEmailVerified: false
    })

    const { unHashedToken, hashedToken, tokenExpiry } = user.generateTemporaryToken()

    user.emailVerficationToken = hashedToken

    user.emailVerficationExpiry = tokenExpiry

    await user.save({ validateBeforeSave: false })

    await sendEmail({
        email: user?.email,
        subject: "Please verify your email!",
        mailgenContent: emailVerificationMailgenContent(
            user.username,
            `${req.protocol}://${req.get("host")}/api/v1/auth/verify-email/${unHashedToken}`
        )
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken -emailVerficationToken -emailVerficationExpiry"
    )

    if (!createdUser) {
        throw new ApiError(500, "Somethign went wrong while registering a user")
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                { user: createdUser },
                "User registerd succesfully and verification email has been sent to your email."
            )
        )
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body

    if (!email) {
        throw new ApiError(400, "Email is required!")
    }

    const user = await User.findOne({ email })

    if (!user) {
        throw new ApiError(404, "User not exist! ")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(502, "Invalid Password")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const loggedUser = await User.findById(user._id).select(
        "-password -refreshToken -emailVerficationToken -emailVerficationExpiry"
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                500,
                {
                    user: loggedUser,
                    accessToken,
                    refreshToken
                },
                "User logged in !"
            )
        )
})

const logoutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: ""
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out"))
})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                req.user,
                "Current user fetched succesfully !"
            )
        )
})

const verifyEmail = asyncHandler(async (req, res) => {
    const { verificationToken } = req.params

    if (!verificationToken) {
        throw new ApiError(
            404,
            "Email Verification Token is missing",
        )
    }

    let hashedToken = crypto
        .createHash("sha256")
        .update(verificationToken)
        .digest("hex")

    const user = await User.findOne(
        {
            emailVerficationToken: hashedToken,
            emailVerficationExpiry: { $gt: Date.now() }
        })

    if (!user) {
        throw new ApiError(400,
            "Token is Invalid or expired"
        )
    }

    user.emailVerficationToken = undefined
    user.emailVerficationExpiry = undefined

    user.isEmailVerified = true
    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(
            new ApiResponse(200,
                {
                    isEmailVerified: true
                },
                "Emial is Varified"
            )
        )
})

const resendEmailVerfication = asyncHandler(async (req, res) => {
    const user = await User.findOne(req.user?._id)

    if (!user) {
        throw new ApiError(404, "User does not exist!")
    }

    if (user.isEmailVerified) {
        throw new ApiError(409, "Email is already Verified!")
    }

    const { unHashedToken, hashedToken, tokenExpiry } = user.generateTemporaryToken()

    user.emailVerficationToken = hashedToken

    user.emailVerficationExpiry = tokenExpiry

    await user.save({ validateBeforeSave: false })

    await sendEmail({
        email: user?.email,
        subject: "Please verify your email!",
        mailgenContent: emailVerificationMailgenContent(
            user.username,
            `${req.protocol}://${req.get("host")}/api/v1/auth/verify-email/${unHashedToken}`
        )
    })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Mail is sent to youe email ID"
            )
        )
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(400, "Unauthorized Access")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findOne(decodedToken?._id)

        if (!user) {
            throw new ApiError(400, "Invalid Referesh Token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(400, "Refresh Token is expired")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user._id)

        user.refreshToken = newRefreshToken
        await user.save()

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            )

    } catch (error) {
        throw new ApiError(
            401,
            "Invalid refresh token"
        )
    }
})

const forgotPasswordRequest = asyncHandler(async (req, res) => {
    const { email } = req.body

    const user = await User.findOne({ email })

    if (!user) {
        throw new ApiError(
            404,
            "User does not exist", []
        )
    }

    const { unHashedToken, hashedToken, tokenExpiry } = user.generateTemporaryToken()

    user.forgotPasswordToken = hashedToken
    user.forgotPasswordExpiry = tokenExpiry

    await user.save({ validateBeforeSave: false })

    await sendEmail({
        email: user?.email,
        subject: "Password reset request",
        mailgenContent: forgotPasswordMailgenContent(
            user.username,
            `${process.env.FORGOT_PASSWORD_REDIRECT_URL}/${unHashedToken}`
        )
    })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Password reser mail is sent on your eamil id succesfully"
            )
        )
})

const resetForgotPassword = asyncHandler(async (req, res) => {
    const { resetToken } = req.params
    const { newPassword } = req.body

    let hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex")

    const user = await User.findOne({
        forgotPasswordToken: hashedToken,
        forgotPasswordExpiry: { $gt: Date.now() }
    })

    if (!user) {
        throw new ApiError(
            401,
            "Token is Invalid or Expired"
        )
    }

    user.forgotPasswordToken = undefined
    user.forgotPasswordExpiry = undefined

    user.password = newPassword

    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Password Reseted Succesfully!"
            )
        )
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body

    const user = await User.findOne(req.user?._id)

    const isPasswordValid = user.isPasswordCorrect(oldPassword)

    if (!isPasswordValid) {
        throw new ApiError(
            402,
            "Invalid old Password"
        )
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Password Updated Succesfully!"
            )
        )
})

export {
    registerUser,
    loginUser,
    logoutUser,
    verifyEmail,
    getCurrentUser,
    resendEmailVerfication,
    refreshAccessToken,
    forgotPasswordRequest,
    resetForgotPassword,
    changeCurrentPassword
}