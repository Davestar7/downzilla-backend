import mongoose from "mongoose";
import feeddb from "../db/feedbackdb.mjs"

const feedback = await mongoose.Schema({
    userId: {
        required: true,
        type: String
    },
    project: {
        required: true,
        type: String
    },
    message: {
        required: true,
        type: String
    },
    rating: {
        type: Number,
        Default: 0
    }
}, {timestamps: true})

const feedback = feeddb.model("Feedback", feedback)

export default feedback