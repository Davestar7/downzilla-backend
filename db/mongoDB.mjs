import mongoose from "mongoose";
import Feedback from "./feedbackmodel.mjs"

const connectionToDownzilla = async () => {
    try {
       const connect = await mongoose.createConnection(process.env.MONGOOSE_URI, {
            writeConcern: { w: "majority" }
        })
        return connect;
    } catch (error) {
        console.error("failed to get DataBase check internet connection: ", error.message);
    }
}

const connectionToDB = async () => {
     try {
        await connectionToDownzilla.asPromise()
        await Feedback.asPromise()

        console.log("connected to database successfully✌️✌️✌️")
     } catch (e) {
        console.log("😔connection to database failed " + e.message)
        process.exit(1)
     }

}

export default connectionToDB