import mongoose from "mongoose";

const connectToFeedback = async() => {
    try {
        const connect = mongoose.createConnection(process.env.FEEDBACKDBURL, {
            writeConcern: { w: "majority" }
        });
        
        await connect.asPromise()
        
        return connect;
    } catch (e) {
        console.log(e.message)
    }
}

export default connectToFeedback