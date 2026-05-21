import mongoose from "mongoose";

const connectToFeedback = async() => {
    try {
        const connect = mongoose.createConnection(process.env.FEEDBACKDBURL, {
            writeConcern: { w: "majority" }
        });
        console.log(connect)
        await connect.asPromise()
        console.log(connect?.model)
        return connect;
    } catch (e) {
        console.log(e.message)
    }
}

export default connectToFeedback