import mongoose from "mongoose";

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

export default feedback