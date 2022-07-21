import mongoose from "mongoose";
let likeSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        default: new Date().toLocaleString('default', { day: "numeric", month: "long", year: "numeric" })
    }
})
let disLikeSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        default: new Date().toLocaleString('default', { day: "numeric", month: "long", year: "numeric" })
    }
})
let commentSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
        trim: true
    },
    userName: {
        type: String,
        required: true,
        trim: true
    },
    comment: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    blogID: {
        type: String,
        required: true,
        trim: true
    }
})


export default { likeSchema, disLikeSchema, commentSchema }