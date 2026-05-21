import Feedback from "./feedbackdb.mjs"
import connectionToDownzilla from "./mongoDB.mjs"

const connectionToDB = async () => {
     try {
        await connectionToDownzilla
        await Feedback

        console.log("connected to database successfully✌️✌️✌️")
     } catch (e) {
        console.log("😔connection to database failed " + e.message)
        process.exit(1)
     }
}

export default connectionToDB