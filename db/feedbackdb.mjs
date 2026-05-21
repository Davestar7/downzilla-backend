import mongoose from "mongoose";

const connectToFeedback = async() => {
    try {
        const connect = await mongoose.createConnection(process.env.FEEDBACKDBURL, {
            writeConcern: { w: "majority" }
        });
        
        return connect;
    } catch (e) {
        console.log(e.message)
    }
}

export default connectToFeedback