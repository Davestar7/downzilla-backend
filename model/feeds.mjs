import mongoose from "mongoose";
import maindb from "../db/mongoDB.mjs"

const renderSchema = new mongoose.Schema({
    url: {
        required: true,
        type: String,
    },
    publiserId: {
        required: true,
        type: String
    },
    publisername: {
        type: String,
        required: true,
    },
    cloudinaryurl: {
        type: String,
    },
    cloudinaryId: {
        type: String,
    },
    stars: {
        type: [String],
        Default: []
    },
    description: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean
    },
    source: {
        type: String,
    },
    type: {
        type: String,
        required: true
    }
}, {timestamps: true})

export default const Render = maindb.model("Render", renderSchema)