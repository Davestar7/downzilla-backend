import Render from "../model/feeds.mjs"
import User from "../model/user.mjs"
import connectionToDB from "../db/mongoDB.mjs"
import mongoose from "mongoose"
// import { MongoClient } from "mongodb";
// import dotenv from "dotenv"
// dotenv.config()

// let client;
// try {
//     client = new MongoClient(process.env.MONGOOSE_URI);
//     await client.connect()
// } catch (e) {
//     console.log(`error tring to run db client: ${e.message}`)
// }

const starContent = async(req, res) => {
  const {userId, id, uploaderId} = req.body
  console.log(`to handle star - user id: ${userId} id: ${id} uploaderid ${uploaderId}`)
  if (!userId || !id || !uploaderId) {
      return res.status(404).json({
        success: false,
        message: "not identified"
      })
    }
    console.log(`begin staring...`)

    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
      
          const resp = await Render.updateOne(
              { _id: id },
              { $addToSet: { stars: userId } },
              { session }
          );
          console.log(resp)
        
          if (resp.modifiedCount > 0) {
            await User.updateOne(
                { _id: uploaderId },
                { $inc: { stars: 1 } },
                { session }
            );
          }
          
          res.status(200).json({
            success: true,
            message: "success"
          })
      
      })
    } finally {
      await session.endSession();
    }
}


const removeStar = async(req, res) => {
  const {userId, id, uploaderId} = req.body

    if (!userId || !id || uploaderId) {
      return res.status(404).json({
        success: false,
        message: "not identified"
      })
    }
    
    const session = mongoose.startSession();
    
    try {
      await session.withTransaction( async () => {
    
        const resp = await Render.updateOne(
          { _id: id },
          { $pull: { stars: userId } },
          { session }
        );
    
        // Only decrement if actually removed
        if (resp.modifiedCount > 0) {
          await User.updateOne(
            { _id: uploaderId },
            { $inc: { stars: -1 } },
            { session }
          );
        }
  
        res.status(200).json({
          success: true,
          message: "success"
        })
      })
    } finally {
      await session.endSession();
    }
}

const getStaredContent = async(req, res) => {
  const { id } = req.body
  if (!id) {
    return res.status(404).json({
      success: false,
      message: "user not found, try reauthencating"
    })
  }
  
  
}

export { starContent, removeStar, getStaredContent }