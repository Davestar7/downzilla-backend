import mongoose from "mongoose";

const connectionToDownzilla = async () => {
    try {
       const connect = await mongoose.createConnection(process.env.MONGOOSE_URI, {
            writeConcern: { w: "majority" }
        }).asPromise()
        return connect;
    } catch (error) {
        console.error("failed to get DataBase check internet connection: ", error.message);
    }
}

export default connectionToDownzilla