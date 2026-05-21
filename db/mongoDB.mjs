import mongoose from "mongoose";

const connectionToDB = async () => {
    try {
       const connect = await mongoose.createConnection(process.env.MONGOOSE_URI, {
            writeConcern: { w: "majority" }
        })
        console.log("connected to database successfully!!!")
        return connect;
    } catch (error) {
        console.error("failed to get DataBase check internet connection: ", error.message);
        process.exit(1)
    }
}

export default connectionToDB