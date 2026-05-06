import mongoose from "mongoose";
import feedbackS from "../../model/feedbackmodel.mjs"

const givefeedback = async(req, res) => {
    const { id, project = downzilla, message, rating = 0 } = req.body
    try {
        if (!id || !message) {
            return res.status(404).json({
              success: false,
              message: incomplete field sent
            })
        }
        
        const check = feedbackS.findOne({$or [userId: id]})
        if (ckeck) {
            await feedbackS.findByIdAndDelete(check._id)
        }
        
        await feedbackS.create({
            userId: id,
            project: project,
            message: message,
            rating: rating
        })
        
        res.status(200).json({
          success: true,
          message: "successfull"
        })
    } catch (e) {
        res.status(500).json({
          success: false,
          message: e.message
        })
    }
}

export default givefeedback

