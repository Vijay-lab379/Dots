import { User } from "../models/user.module.js";
import { ProjectMember } from "../models/projectmember.models.js";
import { ApiError } from "../utils/api-error.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
        throw new ApiError(401, "Unauthorized request")
    }

    try {
        const decondedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decondedToken?._id).select("-password -refreshToken -emailVerficationToken -emailVerficationExpiry")

        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }

        req.user = user
        next()
    } catch (err) {
        throw new ApiError(401, "Invalid Access Token")
    }
})

export const validateProjectPermision = (roles = []) => {
    return asyncHandler(async (req, res, next) => {
        const { projectId } = req.params

        if (!projectId) {
            throw new ApiError(404, "project Id is missng")
        }

        const project = await ProjectMember.findOne({
            project: new mongoose.Types.ObjectId(projectId),
            user: new mongoose.Types.ObjectId(req.user._id)
        })

        if (!project) {
            throw new ApiError(404, "project not found")
        }
        
        const givenRole = project?.role

        req.user.role = givenRole

        if (!roles.includes(givenRole)) {
            throw new ApiError(502, "You do no thave permision to perform this action  ")
        }
        
        next()
    })
}

