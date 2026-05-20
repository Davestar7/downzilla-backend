import mongoose from "mongoose";

async function connectToFeedback() {
    try {
        await mongoose.createConnection(process.env.FEEDBACKDBURL, {
            writeConcern: { w: "majority" }
        });
        
        console.log("feed back database connected")
    } catch (e) {
        console.log(e.message)
        process.exit(1)
    }
}

export default connectToFeedback