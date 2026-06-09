import mongoose, { Schema, trusted } from "mongoose"
import { AvailabelTaskStatusEnum, TaskStatusEnum} from "../utils/constants.js"


const taskSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description:{
        type: String
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    assignedTo:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    assignedBy:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type : String,
        enum: AvailabelTaskStatusEnum,
        default: TaskStatusEnum.TODO
    },
    attachments: {
        type: [{
            url: String,
            mimetype: String,
            size: Number
        }],
        default: []
    }
},{ timestamps: true})

export const Task = mongoose.model("Task",taskSchema)