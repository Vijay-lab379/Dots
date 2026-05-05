import { User } from "../models/user.module.js"
import { Project } from "../models/project.models.js"
import { ProjectMember } from "../models/projectmember.models.js"
import { ApiResponse } from "../utils/api-response.js"
import { ApiError } from "../utils/api-error.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import crypto, { hash } from "crypto"
import mongoose from "mongoose"
import { AvailabelRole, UserRolesEnum } from "../utils/constants.js"


const getProjects = asyncHandler(async (req, res) => {
    const Projects = await ProjectMember.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "projects",
                localField: "project",
                foreignField: "_id",
                as: "projects",
                pipeline: [
                    {
                        $lookup: {
                            from: "projectmembers",
                            localField: "_id",
                            foreignField: "projects",
                            as: "projectmembers"
                        }
                    },
                    {
                        $addFields: {
                            members: {
                                $size: "$projectmembers"
                            }
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$projects"
        },
        {
            $project: {
                projects: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    createdAt: 1,
                    createdBy: 1,
                },
                role: 1,
                _id: 0
            }
        }
    ])

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            Projects,
            "Projects fetched succesfully"
        ))
})

const getProjectById = asyncHandler(async (req, res) => {
    const { projectId } = req.params || req.body
    const project = await Project.findById(projectId)

    if (!Project) {
        throw new ApiError(
            404, "Project not found"
        )
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                project,
                "Project fetched Succesfullly!"
            )
        )
})

const createProject = asyncHandler(async (req, res) => {
    const { name, description } = req.body
    const project = await Project.create({
        name,
        description,
        createdBy: new mongoose.Types.ObjectId(req.user._id)
    })  

    await ProjectMember.create({
        user: new mongoose.Types.ObjectId(req.user._id),
        project: new mongoose.Types.ObjectId(project._id),
        role: UserRolesEnum.ADMIN
    })

    return res
        .status(201)
        .json(new ApiResponse(
            201,
            "Project Created Succesfully"
        ))
})

const updateProject = asyncHandler(async (req, res) => {
    const { name, description } = req.body
    const { projectId } = req.params
    const project = await Project.findByIdAndUpdate(
        projectId,
        {
            name,
            description
        },
        { new: true }
    )

    if (!project) {
        throw new ApiError(
            404,
            "Project not found"
        )
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            project,
            "Project updated succesfully"
        ))
})

const deleteProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params
    const project = await Project.findByIdAndDelete(projectId)
    if (!project) {
        throw new ApiError(
            404,
            "Project does not exist"
        )
    }
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            "Project deleted succesfully"
        ))
})

const getProjectMembers = asyncHandler(async (req, res) => {
    const { projectId } = req.params
    const project = await Project.findById(new mongoose.Types.ObjectId(projectId))

    if (!project) {
        throw new ApiError(404, "Project Not Found")
    }

    const projectmembers = await ProjectMember.aggregate([
        {
            $match: {
                project: project._id
            }
        },

        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            username: 1,
                            fulllName: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                user: {
                    $arrayElemAt: ["$user", 0]
                }
            }
        },
        {
            $project: {
                project: 1,
                user: 1,
                role: 1,
                createdAt: 1,
                updatedAt: 1,
                _id: 0
            }
        }
    ])

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            projectmembers,
            "Project Members fetched succesfully"
        ))
})

const addMemberToProject = asyncHandler(async (req, res) => {
    const { email, role } = req.body
    const { projectId } = req.params

    const user = await User.findOne({ email })

    if (!user) { throw new ApiError(401, "User does not exist") }

    await ProjectMember.findOneAndUpdate(
        {
            user: new mongoose.Types.ObjectId(user._id),
            project: new mongoose.Types.ObjectId(projectId)
        },
        {
            user: new mongoose.Types.ObjectId(user._id),
            project: new mongoose.Types.ObjectId(projectId),
            role: role
        },
        {
            new: true,
            upsert: true
        }
    )

    return res.status(200).json(new ApiResponse(200, {}, "Project Member added succesfully"))
})

const updateMemberRole = asyncHandler(async (req, res) => {
    const { projectId, userId } = req.params
    const { newRole } = req.body

    if (!AvailabelRole.includes(newRole)) {
        throw new ApiError(404, "Invalid Role")
    }

    let projectmember = await ProjectMember.findOne({
        project: new mongoose.Types.ObjectId(projectId),
        user: new mongoose.Types.ObjectId(userId)
    })

    if (!projectmember) {
        throw new ApiError(404, "Project Member not found")
    }

    projectmember = await ProjectMember.findOneAndUpdate(
        projectmember._id,
        {
            role: newRole
        },
        {
            new: true
        }
    )

    if (!projectmember) {
        throw new ApiError(404, "Project Member not found")
    }

    return res.
        status(200)
        .json(new ApiResponse(
            200,
            projectmember,
            "Project Member Role updated succesfully"
        ))

})

const deleteMember = asyncHandler(async (req, res) => {
    const { projectId, userId } = req.params
    
    let projectmember = await ProjectMember.findOne(
        {
            user: new mongoose.Types.ObjectId(userId),
            project: new mongoose.Types.ObjectId(projectId)
        }
    )

    if (!projectmember) {
        throw new ApiError(404, "Project Member not found")
    }

    projectmember = await ProjectMember.findByIdAndDelete(
        projectmember._id,
    )

    if (!projectmember) {
        throw new ApiError(404, "Project Member not found")
    }

    return res
    .status(200)
    .json( new ApiResponse(
        200,
        projectmember,
        "Project Member deleted succesfully"
    ))
})

export {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    getProjectMembers,
    addMemberToProject,
    updateMemberRole,
    deleteMember
}