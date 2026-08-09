import Render from "../model/feeds.mjs"
import uploadToCloud from "../config/cloudinayhelper.mjs"
import User from "../model/user.mjs"
import connectionToDB from "../db/mongoDB.mjs"

const returnData = async (req, res) => {
    const page = req.headers["page"]
    const limit = 6;

    
    if (!page) {
        page = 1
    }

    try {

        const data = await Render.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit)
        
        if (!data) {
            return res.status(404).json({
                success: false,
                message: "data not found"
            })
        }

        const totalObject = await Render.countDocuments()
        if (!totalObject) {
            return res.status(400).json({
                success: false,
                message: "unable to complete operation"
            })
        }

        res.status(200).json({
            success: true,
            data: data,
            totalPage: Math.ceil(totalObject / limit),
            currentPage: page,
            message: "success"
        })
    } catch (e) {
        res.status(500).json({
            success: false,
            message: "error occured geting content",
            error: e
        })
    }
}

const uploadData = async (req, res) => {
    const body = req.body

    if (!body || !body.url || !body.userId) {
        return res.status(400).json({
            success: false,
            message: "no upload data found"
        })
    }

    const thumbnail = body.thumbnail || null

    try {
        const isAvailable = await Render.findOne({ url: body.url })
        if (isAvailable) {
            return res.status(300).json({
                success: false,
                message: "video already available on Downzilla"
            })
        }

        let upres = { url: null, publicId: null }
        console.log(body)

        if (thumbnail) {
            if (typeof thumbnail === "object") {
                upres.publicId = thumbnail.id
                upres.url = thumbnail.url
            } else {
                upres = await uploadToCloud(thumbnail)
            }
        }
        console.log("don updating thumbnail")

        const feed = await Render.create({
            url: body.url,
            publiserId: body.userId,
            publisername: body.uploadername,
            stars: 0,
            description: body.description,
            title: body.title,
            isActive: true,
            cloudinaryId: upres.publicId,
            cloudinaryurl: upres.url,
            source: body.source,
            type: body.type
        })

        await User.findOneAndUpdate(
            {
                _id: body.userId,
                "downloadHistory.url": body.url
            },
            {
                $set: {
                    "downloadHistory.$.isPublic": true,
                    "downloadHistory.$.publicId": feed._id
                }
            },
            { runValidators: true }
        )

        res.status(201).json({
            success: true,
            message: "uploaded successfully"
        })

    } catch (e) {
        console.error('uploadData error:', e.message)
        res.status(500).json({
            success: false,
            message: "error uploading details",
            error: e.message
        })
    }
}

const getSingleContent = async (req, res) => {
    const id = req.body.id
    
    if (!id) {
        return res.status(404).json({
            success: false,
            message: "no content id found"
        })
    }

    try {
        const data = await Render.findById(id)
        if (!data) {
            return res.status(404).json({
                sucess: false,
                message: "Content not found"
            })
        }
        if (data.isActive === false) {
            return res.status(400).json({
                success: false,
                message: "this Content may have been deleted"
            })
        }

        res.status(201).json({
            success: true,
            data: data
        })

    }catch (e) {
        res.status(500).json({
            success: false,
            message: "Error occured"
        })
    }
}

const searchContent = async (req, res) => {
    const text = req.body.text
    
    if (!text) {
        return res.status(404).json({
            success: false,
            message: "no keyword found"
        })
    }

    // const words = text.split(" ")
    try {
        const regex = new RegExp(text, 'i')
        const result = await Render.find({
            $or: [
                    { title: {$regex: regex} },
                    { description: {$regex: regex} },
                    { source: {$regex: regex} }
                ]
            },
                // {title: 1, description: 1, source: 1}
            ).exec()

        
        res.status(200).json({
            success: true,
            data: result
        })
    } catch (e) {
        
        res.status(500).json({
            success: false,
            message: "error: " + e.message
        })
    }
}

export {returnData, uploadData, getSingleContent, searchContent}
