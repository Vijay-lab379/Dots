import { User } from "../models/user.module.js";
import { ApiError } from "../utils/api-error.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken";

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