import { ProjectNote } from "../models/note.models.js"
import { Project } from "../models/project.models.js"
import { ApiResponse } from "../utils/api-response.js"
import { ApiError } from "../utils/api-error.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import mongoose from "mongoose"

const getProjectNotes = asyncHandler(async (req, res) => {
    const { projectId } = req.params

    const project = await Project.findById(new mongoose.Types.ObjectId(projectId))

    if (!project) {
        throw new ApiError(404, "Project not found!")
    }

    const ProjectNotes = await ProjectNote.find({
        project: new mongoose.Types.ObjectId(project._id)
    }).populate("createdBy", "avatar username fullName")

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                ProjectNotes,
                "Notes fetched succeesfully"
            ))
})

const createProjectnote = asyncHandler(async (req, res) => {
    const { projectId } = req.params
    const { content } = req.body

    const project = await Project.findById(new mongoose.Types.ObjectId(projectId))

    if (!project) { throw new ApiError(404, "Project Not Found!") }

    const projectNote = await ProjectNote.create({
        project: new mongoose.Types.ObjectId(project._id),
        content,
        createdBy: new mongoose.Types.ObjectId(req.user._id)
    })

    if (!projectNote) { throw new ApiError(404, "error occoured while creating note!") }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            projectNote,
            "Project Note created succesfuly!"
        ))
})

const getNotebyId = asyncHandler(async (req, res) => {
    const { projectId, noteId } = req.params

    const projectNote = await ProjectNote.findOne({
        project: new mongoose.Types.ObjectId(projectId),
        _id: noteId
    })

    if (!projectNote) { throw new ApiError(404, "Note not found") }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            projectNote,
            "Note fetched successfuly!"
        ))
})

const updateProjectNote = asyncHandler(async (req, res) => {
    const { projectId, noteId } = req.params
    const { content } = req.body

    let projectNote = await ProjectNote.findOne({
        project: new mongoose.Types.ObjectId(projectId),
        _id: noteId
    })

    if (!projectNote) { throw new ApiError(404, "Note not found") }

    projectNote = await ProjectNote.findByIdAndUpdate(
        projectNote._id,
        { content },
        { new: true }
    )
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            projectNote,
            "Note Updated successfuly!"
        ))
})

const deleteProjectNote = asyncHandler(async (req, res) => {
    const { projectId, noteId } = req.params

    const projectNote = await ProjectNote.findOneAndDelete({
        project: new mongoose.Types.ObjectId(projectId),
        _id: new mongoose.Types.ObjectId(noteId)
    })

    if (!projectNote) { throw new ApiError(404, "Note not found") }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            projectNote,
            "Note Deleted successfuly!"
        ))
})

export {
    createProjectnote,
    getProjectNotes,
    getNotebyId,
    updateProjectNote,
    deleteProjectNote
}
