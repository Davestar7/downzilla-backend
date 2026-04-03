// import connectToCloudinary from "./cloudinary.mjs"
import {v2 as cloudinary} from "cloudinary"
import axios from "axios"

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_SECRET_KEY
})

async function uploadToCloud(imgurl) {
    const img = imgurl
    console.log(img)
    if (img == null) {
        return {
            url: null,
            publicId: null
        }
    }

    const thumres = await axios.get(img, {
        responseType: "arraybuffer",
        headers: {
            "User-Agent": "Mozilla/5.0"
        }
    })

    console.log(`config check:
        cloud: ${cloudinary.config().cloud_name},
        key: ${cloudinary.config().api_key},
        secret: ${cloudinary.config().api_secret ? "set" : "missing"}
    `)

    try {
        const upload = await cloudinary.uploader.upload(`data:image/jpeg;base64,${Buffer.from(thumres.data).toString("base64")}`, {
            folder: "thumbnails",
            resource_type: "image"
        })
        console.log("finshed upload ",upload)
        return {
            url : upload.secure_url,
            publicId : upload.public_id
        }
    } catch (e) {
        console.log(e.message)
        throw new Error(e.message)
    }
}

export default uploadToCloud