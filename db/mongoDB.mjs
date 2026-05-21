import mongoose from "mongoose";

const connectionToDownzilla = async () => {
    try {
       const connect = mongoose.createConnection(process.env.MONGOOSE_URI, {
            writeConcern: { w: "majority" }
        })
        await connect.asPromise()
        return connect;
    } catch (error) {
        console.error("failed to get DataBase check internet connection: ", error.message);
    }
}

export default connectionToDownzilla