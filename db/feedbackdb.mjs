import mongoose from "mongoose";

function connectToFeedback() {
    try {
        await mongoose.connect(process.env.FEEDBACKDBURL, {
            writeConcern: { w: "majority" }
        });
        
        console.log("feed back database connected")
    } catch (e) {
        console.log(e.message)
        process.exit(1)
    }
}

export default connectToFeedback