import mongoose from "mongoose";
import user from "../model/user.mjs";
import crypto from "crypto"
import feeds from "../model/feeds.mjs";
import uploadToCloud from "../config/cloudinayhelper.mjs";

const toHistory = async (req, res) => {
    const body = req.body
    console.log(body.id)
    // const historyId = crypto.randomUUID()

    try {
        let img
        if (body.thumbnail) {
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
                    cloudinaryUrl: img.url || null,
                    cloudinaryId: img.publicId || null,
                    type: body.type,
                    source: body.source,
                    stars: 0,
                    isPublic: false,
                    publicId: null
                }
            }
        })
        console.log("done uploading " + up.acknowledged + up.upsertedId)

        res.status(200).json({
            success: true,
            message: "uploaded"
        })
    } catch (e) {
        console.log(e)
        res.status(500).json({
            success: false,
            error: e,
            message: `something went wong on the server`
        })
    }
}

const getHistory = async (req, res) => {
    const { id } = req.body
    console.log(id)
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
        console.log(`catach error: ${e}`)
        res.status(500).json({
            success: false,
            message: "error occured while getting data"
        })
    }
}

const getSingleHistory = async (req, res) => {
    const id = req.body.id
    const Hid = req.body.Hid

    console.log(`id single history ${id}`)
    if (!id) {
        res.status(404).json({
            success: false,
            message: "id not found"
        })
    }
    if (!Hid) {
        res.status(404).json({
            success: false,
            message: "content id not found"
        })
    }

    try {
        const tuser = await user.findById(id)
        const his = tuser.downloadHistory.id(Hid)
        console.log(his)
        
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
    const { userId, id, publicId } = req.body
    
    try {
        if (!userId || !id) {
            return res.status(404).json({
                success: false,
                message: "id not missing"
            })
        }

        const del = await user.updateOne(
            { _id: userId },
            {
                $pull: {
                    downloadHistory: {
                        _id: id
                    }
                }
            }
        )

        await feeds.findByIdAndDelete(publicId)

        console.log(del)
        res.status(200).json({
            success: true,
            message: "deleted succefully"
        })
    } catch (e) {
        res.status(500).json({
            success: false,
            message: "failed to delete"
        })
    }
}

export { toHistory, getHistory, getSingleHistory, removeHistory }