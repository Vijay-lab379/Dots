import { User } from "../models/user.module.js"
import { Project } from "../models/project.models.js"
import { Task } from "../models/task.models.js"
import { subtask } from "../models/subtask.models.js"
import { ApiResponse } from "../utils/api-response.js"
import { ApiError } from "../utils/api-error.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import crypto, { hash } from "crypto"
import mongoose from "mongoose"
import { AvailabelRole, UserRolesEnum } from "../utils/constants.js"

const getTasks = asyncHandler(async (req, res) => {
    const { projectId } = req.params

    if (!projectId) {
        throw new ApiError(
            404,
            "Project not found"
        )
    }

    const tasks = await Task.find(
        { project: new mongoose.Types.ObjectId(projectId) }
    ).populate("assignedTo", "avatar username fullName")

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                tasks,
                "Tasks fetched succeesfully"
            ))
})

const createTask = asyncHandler(async (req, res) => {
    const { title, description, assignedTo, status } = req.body
    const { projectId } = req.params

    const project = await Project.findById(projectId)

    if (!project) {
        throw new ApiError(
            404,
            "Project not found"
        )
    }

    const files = req.files || []

    const attachments = files.map((file) => {
        return {
            url: `${process.env.SERVER_URL}/images/${file.originalname}`,
            mimetype: file.mimetype,
            size: file.size
        }
    })


    const task = await Task.create(
        {
            title,
            description,
            assignedTo: assignedTo ? new mongoose.Types.ObjectId(assignedTo) : undefined,
            status,
            assignedBy: req.user._id,
            project: new mongoose.Types.ObjectId(projectId),
            attachments: attachments
        }
    )

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                task,
                "Task created succesfully"
            )
        )
})

const getTaskById = asyncHandler(async (req, res) => {
    //This method suposed to give -> tasks, subtask with assignies.
    const { taskId } = req.params
    //we use mongoDB aggregation pipeline for it
    const task = await Task.aggregate([
        {   // pick the task with desired taskId
            $match: {
                _id: new mongoose.Types.ObjectId(taskId)
            }
        },
        {   //lookup for user it assigned to 
            $lookup: {
                from: "users",
                localField: "assignedTo",
                foreignField: "_id",
                as: "assignedTo",
                //fetching the desired details of the User
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            username: 1,
                            fullname: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {   //Lookup for 'subtask' using 'Id of task' to task in subtask
            $lookup: {
                from: "subtasks",
                localField: "_id",
                foreignField: "task",
                as: "subtasks",
                pipeline: [
                    {   //lookup to whose these SUBTASK created
                        $lookup: {
                            from: "users",
                            localField: "createdBy",
                            foreignField: "_id",
                            as: "createdBy",
                            pipeline: [
                                {
                                    $project: {
                                        _id: 1,
                                        username: 1,
                                        fullname: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {  //Changineg createdBy array to field
                        $addFields: {
                            createdBy: {
                                $arrayElemAt: ["$createdBy", 0]
                            }
                        }
                    }
                ]
            }
        },
        {   //Changing assignedTo array to field
            $addFields: {
                assignedTo: {
                    $arrayElemAt: ["$assignedTo", 0]
                }
            }
        }
    ])

    if (!task || task.length === 0) {
        throw new ApiError(
            404,
            "Task not found"
        )
    }

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                task,
                "Task fetched Succesfully!"
            )
        )

})

const updateTask = asyncHandler(async (req, res) => {
    const { title, description, assignedTo, status } = req.body
    const { projectId, taskId } = req.params

    let task = await Task.findOne({
        _id: new mongoose.Types.ObjectId(taskId),
        project: new mongoose.Types.ObjectId(projectId)
    })

    if (!task) {
        throw new ApiError(
            404,
            "Task not found!"
        )
    }
    const files = req.files || []

    const attachments = files.map((file) => {
        return {
            url: `${process.env.SERVER_URL}/images/${file.originalname}`,
            mimetype: file.mimetype,
            size: file.size
        }
    })

    task = await Task.findByIdAndUpdate(
        task._id,
        {
            title,
            description,
            assignedTo,
            status,
            attachments: attachments
        },
        { new: true }
    )

    if (!task) {
        throw new ApiError(
            404,
            "Error ocoured while updatein task!"
        )
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            task,
            "Task Updated Succesfully!"
        ))
})

const deleteTask = asyncHandler(async (req, res) => {
    const { projectId, taskId } = req.params
    const task = await Task.findOneAndDelete(
        {
            _id: taskId,
            project: projectId
        }
    )

    if (!task) {
        throw new ApiError(404, "Task not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, task, "Task deleted succesfuly!"))
})

const createSubtask = asyncHandler(async (req, res) => {
    const { title } = req.body
    const { projectId, taskId } = req.params

    const task = await Task.findOne({
        _id: taskId,
        project: projectId
    })

    if (!task) {
        throw new ApiError(404, "Task not found")
    }

    const newSubtask = await subtask.create({
        title,
        task: new mongoose.Types.ObjectId(taskId),
        createdBy: new mongoose.Types.ObjectId(req.user._id)
    })

    if (!newSubtask) {
        throw new ApiError(404, "Subtask can't be created!")
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            newSubtask,
            "Subtask created Succesfully!"
        ))
})

const updateSubtask = asyncHandler(async (req, res) => {
    const { projectId, subTaskId } = req.params
    const { title, isCompleted } = req.body

    const task = await Task.findOne({
        project: new mongoose.Types.ObjectId(projectId)
    })

    if (!task) { throw new ApiError(404, "Task not found") }

    let newSubtask = await subtask.findById(new mongoose.Types.ObjectId(subTaskId))

    if (!newSubtask) { throw new ApiError(404, "Subbtask not found!") }

    newSubtask = await subtask.findByIdAndUpdate(
        newSubtask._id,
        {
            title,
            isCompleted
        },
        { new: true })

    if (!newSubtask) { throw new ApiError(404, "Subbtask not found!") }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            newSubtask,
            "subtsak updated successfuly!"
        ))
})

const deleteSubtask = asyncHandler(async (req, res) => {
    const { projectId, subTaskId } = req.params

    const task = await Task.findOne({
        project: new mongoose.Types.ObjectId(projectId)
    })

    if (!task) { throw new ApiError(404, "Task not found") }

    const newSubtask = await subtask.findOneAndDelete(
        {
            _id: new mongoose.Types.ObjectId(subTaskId),

        }
    )

    if (!newSubtask) { throw new ApiError(404, "subtask not found!") }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            newSubtask,
            "Subtask deleted sucussesfuly!"
        ))
})


export {
    getTasks,
    createTask,
    getTaskById,
    updateTask,
    deleteTask,
    createSubtask,
    updateSubtask,
    deleteSubtask
} 