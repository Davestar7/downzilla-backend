import Render from "../model/feeds.mjs"
import User from "../model/user.mjs"
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGOOSE_URI);

const starContent = async(req, res) => {
  const {userId, id, uploaderId} = req.body
  if (!userId || !id || uploaderId) {
    return res.status(404).json({
      success: false,
      message: "not identified"
    })
    
    const session = client.startSession();
    try {
      await session.withTransaction(async () => {
      
        const resp = await Render.collection('stars').updateOne(
            { _id: id },
            { $addToSet: { stars: userId } },
            { session }
        );
      
        if (resp.modifiedCount > 0) {
          await User.collection('stars').updateOne(
              { _id: uploaderId },
              { $inc: { stars: 1 } },
              { session }
          );
        }
        
        res.status(200).json({
          success: true,
          message "success"
        })
      
      });
      } finally {
        await session.endSession();
      }.catch((e) => {
        console.error('Promise Catch:', e);
        res.status(500).json({
          success: false,
          message: "server error"
        })
        await session.endSession();
      })
  }
  
}

const removeStar = async(req, res) => {
  const {userId, id, uploaderId} = req.body
  if (!userId || !id || uploaderId) {
    return res.status(404).json({
      success: false,
      message: "not identified"
    })
    
    const session = client.startSession();
    
    try {
      await session.withTransaction(async () => {
    
        const resp = await Render.collection('stars').updateOne(
          { _id: id },
          { $pull: { stars: userId } },
          { session }
        );
    
        // Only decrement if actually removed
        if (resp.modifiedCount > 0) {
          await User.collection('stars').updateOne(
            { _id: uploaderId },
            { $inc: { stars: -1 } },
            { session }
          );
        }
  
        res.status(200).json({
          success: true,
          message "success"
        })
      });
    } finally {
      await session.endSession();
    }.catch((e) => {
        console.error('Promise Catch:', e);
        res.status(500).json({
          success: false,
          message: "server error"
        })
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