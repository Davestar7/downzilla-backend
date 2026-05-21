import Render from "../model/feeds.mjs"
import User from "../model/user.mjs"
import connectionToDB from "../db/mongoDB.mjs"
import mongoose from "mongoose"

const starContent = async(req, res) => {
  const {userId, id, uploaderId} = req.body
  
  if (!userId || !id || !uploaderId) {
      return res.status(404).json({
        success: false,
        message: "not identified"
      })
    }
    
    try {
        
            const resp = await Render.updateOne(
                { _id: id },
                { $addToSet: { stars: userId } },
                { session }
            );
            
            if (resp.modifiedCount > 0) {
               const re =  await User.updateOne(
                  { _id: uploaderId },
                  { $inc: { totalStars: +1 } },
                  { session }
              );
              
            }
            
            res.status(200).json({
              success: true,
              message: "success"
            })
        
    } catch (e) {
      res.status(500).json({
        success: false,
        message: `error: ${e.message}`
      })
    }
}


const removeStar = async(req, res) => {
  const {userId, id, uploaderId} = req.body

    if (!userId || !id || !uploaderId) {
      return res.status(404).json({
        success: false,
        message: "not identified"
      })
    }

    try {
      
          const resp = await Render.updateOne(
            { _id: id },
            { $pull: { stars: userId } },
            { session }
          );
      
          // Only decrement if actually removed
          if (resp.modifiedCount > 0) {
            await User.updateOne(
              { _id: uploaderId,
                totalStars: { $gt: 0 } },
              { $inc: { totalStars: -1 } },
              { session }
            );
          }
    
          res.status(200).json({
            success: true,
            message: "success"
          })
   
    } catch (e) {
      res.status(500).json({
        success: false,
        message: `error: ${e.message}`
      })
    }
}

const gettotalstars = async(req, res) => {
  const { id } = req.body
  if (!id) {
    return res.status(404).json({
      success: false,
      message: "user not found, try reauthencating"
    })
  }
  
  try {
    const resp = await User.findById(id)
    if (!resp) {
      return res.status(400).json({
        success: false,
        message: e.message
      })
    }

    res.status(200).json({
      success: true,
      total: resp.totalStars
    })
  } catch (e) {
    
    res.status(500).json({
      success: false,
      message: e.message
    })
  }
}

const getStaredContent = async (req, res) => {
  const { id } = req.body
  if (!id) {
    return res.status(404).json({
      success: false,
      message: "user not found, try reauthencating"
    })
  }

  try {
    const result = await Render.find({
      stars: id
    })

    if (!result) {
      return res.status(400).json({
        success: false,
        message: "no stared content found"
      })
    }
    res.status(200).json({
      success: true,
      data: result
    })
  } catch (e) {
    
    res.status(500).json({
      success: false,
      message: e.message
    })
  }
}

export { starContent, removeStar, getStaredContent, gettotalstars }
