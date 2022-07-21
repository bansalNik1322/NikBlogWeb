import mongoose from "mongoose";
import likes from "./likeModel.js"
let likeSchema = likes.likeSchema
let disLikeSchema = likes.disLikeSchema
let commentSchema = likes.commentSchema
let blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    userID: {
        type: String,
        required: true,
        trim: true,
    },
    author : {
        type: String,
        required: true,
        trim: true,
    },
    writtenDate: {
        type: Date,
        default: new Date().toLocaleString('default', { day: "numeric", month: "long", year:"numeric" })
    },
    postedOrNot : {
        type : Boolean,
        default : false
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    likes: [Object],
    comments : [Object]

}, { timestamps: true })

let blogModel = mongoose.model("Blog", blogSchema)
export default blogModel