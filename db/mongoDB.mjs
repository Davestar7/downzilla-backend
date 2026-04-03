import mongoose from "mongoose";

const connectionToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGOOSE_URI, {
            writeConcern: { w: "majority" }
        })
        console.log("connected to database successfully!!!")
    } catch (error) {
        console.error("failed to get DataBase check internet connection: ", error);
        process.exit(1)
    }
}

export default connectionToDB