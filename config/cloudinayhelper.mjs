// import connectToCloudinary from "./cloudinary.mjs"
import dotenv from "dotenv"
import {v2 as cloudinary} from "cloudinary"
import axios from "axios"
dotenv.config()

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_SECRET_KEY
})

async function uploadToCloud(imgurl) {
    const img = imgurl
    
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

    
    try {
        const upload = await cloudinary.uploader.upload(`data:image/jpeg;base64,${Buffer.from(thumres.data).toString("base64")}`, {
            folder: "thumbnails",
            resource_type: "image"
        })
        
        return {
            url : upload.secure_url,
            publicId : upload.public_id
        }
    } catch (e) {
        
        throw new Error(e.message)
    }
}

export default uploadToCloud