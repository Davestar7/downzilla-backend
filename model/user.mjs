import { timeStamp } from "console";
import mongoose from "mongoose";
import { type } from "os";
import { stringify } from "querystring";

const downloadSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    cloudinaryUrl: {
        type: String,
        default: null,
    },
    cloudinaryId: {
        type: String,
        default: null,
    },
    type: {
        type: String,
        required: true
    },
    source: {
        type: String,
        required: true
    },
    stars: {
        type: Number,
        required: true
    },
    publicId: {
        type: String,
        required: true,
    },
    isPublic: {
        type: Boolean,
        required: true
    }
})

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        unique: true,
        required: true,
    },
    downloadHistory: {
        type: [downloadSchema],
        default: []
    },
    totalStars: {
        type: Number,
        default: 0,
    },
    stared: {
        type: [String]
    }

}, {timeStamp : true})

export default mongoose.model("User", userSchema)