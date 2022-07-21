import mongoose from "mongoose";


let userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    userName: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    gender: {
        type: String,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
    },
    token: {
        type: String,
    },
    verify: {
        type: Boolean,
        default: false
    },
    blogs: [String]
}, { timestamps: true })

let userModel = mongoose.model("User", userSchema)
export default userModel