import mongoose from "mongoose";

const connectToFeedback = async() => {
    try {
        const connect = await mongoose.createConnection(process.env.FEEDBACKDBURL, {
            writeConcern: { w: "majority" }
        });
        
        console.log("feed back database connected")
        return connect;
    } catch (e) {
        console.log(e.message)
        process.exit(1)
    }
}

export default connectToFeedback