import mongoose from "mongoose";
import user from "../model/user.mjs";
import crypto from "crypto"
import feeds from "../model/feeds.mjs";
import uploadToCloud from "../config/cloudinayhelper.mjs";

const toHistory = async (req, res) => {
    const body = req.body
    
    // const historyId = crypto.randomUUID()
    if (!body) {
      return res.status(404).json({
         success: false,
         message: "data not found"
      })
    }
    try {
        const check = await user.findOne({
            _id: new mongoose.Types.ObjectId(body.id),
            $and: [
                {'downloadHistory.title': body.title},
                {'downloadHistory.url': body.url}
            ]
        })
        if (check) {
            
            return res.status(401).json({
                success: false,
                message: "this activity already exists on your history"
            })
        }

        let img
        if (body?.thumbnail) {
            img = await uploadToCloud(body.thumbnail)
        }
       const up =  await user.updateOne({
            _id: body.id,
            "downloadHistory.url": {$ne: body.url}
        },
        {
            $push: {
                downloadHistory: {
                    url: body.url,
                    title: body.title,
                    description: body.description,
                    cloudinaryUrl: img?.url || null,
                    cloudinaryId: img?.publicId || null,
                    type: body.type,
                    source: body.source,
                    stars: 0,
                    isPublic: false,
                    publicId: null
                }
            }
        })
        
        res.status(200).json({
            success: true,
            message: "uploaded"
        })
    } catch (e) {
        console.log(e.message)
        res.status(500).json({
            success: false,
            error: e,
            message: `something went wong on the server`
        })
    }
}

const getHistory = async (req, res) => {
    const { id } = req.body
    
    if (!id) {
        return res.status(404).json({
            success: false,
            message: "user id info not found"
        })
    }
    try {
        const userI = await user.findById(id)
        if (!userI) {
            return res.status(404).json({
                success: false,
                message: "user data not found"
            })
        }

        const history = userI.downloadHistory || []
        
        res.status(200).json({
            success: true,
            data: history
        })

    } catch (e) {
        
        res.status(500).json({
            success: false,
            message: "error occured while getting data"
        })
    }
}

const getSingleHistory = async (req, res) => {
    const id = req.body.id
    const Hid = req.body.Hid

    if (!id) {
        return res.status(404).json({
            success: false,
            message: "id not found"
        })
    }
    if (!Hid) {
        return res.status(404).json({
            success: false,
            message: "content id not found"
        })
    }

    try {
        const tuser = await user.findById(id)
        const his = tuser.downloadHistory.id(Hid)

        if (!his) {
            return res.status(404).json({
                success: false,
                message: "Activity not found"
            })
        }
        
        res.status(200).json({
            success: true,
            data: his
        })
    } catch (e) {
        res.status(403).json({
            success: false,
            message: "server error"
        })
    }
}

const removeHistory = async (req, res) => {
    const { userId, id, title = null, url = null, cloudId } = req.body

    try {
        if (!userId || !id) {
            return res.status(400).json({
                success: false,
                message: "incompete data is missing"
            })
        }

        await user.updateOne(
            { _id: userId },
            {
                $pull: {
                    downloadHistory: {
                        _id: id
                    }
                }
            }
        )
        if (cloudId) await uploadToCloud(cloudId, true)

        if (title && url) {
            const ch = await feeds.find({
            title: { $regex: title, $options: 'i' },
            url: { $regex: url, $options: 'i' },
            publiserId: userId
       })

       if (ch.length > 0) {
          await feeds.findByIdAndDelete(ch[0]._id)
       }
     }

        res.status(200).json({
            success: true,
            message: "deleted successfully"
        })

    } catch (e) {
        
        res.status(500).json({
            success: false,
            message: "failed to delete"
        })
    }
}

export { toHistory, getHistory, getSingleHistory, removeHistory }
