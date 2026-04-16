import Render from "../model/feeds.mjs"
import uploadToCloud from "../config/cloudinayhelper.mjs"
import User from "../model/user.mjs"

const returnData = async (req, res) => {
    try {
        const page = req.headers["page"]
        if (!page) {
            page = 1
        }

        const data = await feedbase.find({ })
        if (!data) {
            res.status(404).json({
                success: false,
                message: "data not found"
            })
        }

        res.status(200).json({
            success: true,
            data: data,
            message: "success"
        })
    } catch (e) {
        res.status(500).json({
            success: false,
            message: "error from server",
            error: e
        })
    }
}

const uploadData = async (req, res) => {
    const body = req.body
    const thumbnail = body.thumbnail || null
    if (!body) {
        return res.status(404).json({
            success: false,
            message: "no upload data found"
        })
    }

    const isAvailable = await Render.findOne({url: body.url})
    if (isAvailable) {
        return res.status(300).json({
            success: false,
            message: "video already available on Downzilla"
        })
    }

    
    try {
        let upres = {}
        if (typeof thumbnail === "object") {
           const uptumb = thumbnail
           upres.publicId = uptumb.id
           upres.url = uptumb.url
        } else {
            upres = await uploadToCloud(thumbnail)
        }
        console.log(upres)

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

        console.log(`feed: ${feed._id}`)

        const upuser = await User.findByIdAndUpdate( {
                _id: body.userId,
                "downloadHistory.url": body.url
            }, {
                 $set: {"downloadHistory.$.isPublic": true, "downloadHistory.$.publicId": feed._id}
            }, {
                new: true,
                runValidators: true,
            }
        )


        console.log(`user updated: ${upuser.isModified}`)

        res.status(201).json({
            success: true,
            message: "uploaded successfully"
        })

    } catch (e) {
        res.status(500).json({
            success: false,
            message: "error uploading details",
            error: e
        })
    }
}

export {returnData, uploadData}