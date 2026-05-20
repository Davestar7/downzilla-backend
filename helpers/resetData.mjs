import user from "../model/user.mjs";
import { signAccessToken, signRefreshToken } from "./cookies.mjs";
import bcryptjs from "bcryptjs"
import emailValidator from "../helpers/asist/emailvalibator.mjs"

const resetData = async (req, res) => {
    const { name, email, id, which } = req.body

    try {
        if (!name || !email) {
            return res.status(404).json({
                success: false,
                message: "no data resived"
            })
        }

        
        if (which === "email") {
            resetEmail(email, id, true, req, res)
        } else if (which === "name") {
            resetname(name, email, id, true, req, res)
        } else if (which === "both") {
            await resetEmail(email, id, null, req, res).then(() => {
                resetname(name, email, id, true, req, res)
            })
        }
    } catch (e) {
        res.status(500).json({
            success: false,
            message: "server error"
        })
    }
}

const passwordResetEmail = async (req, res) => {
    const { email } = req.body

    try {
        if (!email) {
            return res.status(404).json({
                success: false,
                message: "email. not found"
            })
        }

        const checkUser = await user.findOne({$or: [{email}]})
            
            if (!checkUser) {
                return res.status(400).json({
                    success: false,
                    message: "invalid detail"
                })
            }

        res.status(200).json({
            success: true,
            id: checkUser.id
        })
    } catch (e) {
        res.status(500).json({
            success: false,
            message: "server error"
        })
    }
}

const resetPassword = async (req, res) => {
    const {password, id} = req.body

    try {
        if (!password || !id) {
            return res.status(404).json({
                success: false,
                message: "new password missing"
            })
        }

        const salt = await bcryptjs.genSalt(10)
        const hash = await bcryptjs.hash(password, salt)

        const reset = await user.updateOne(
            {_id: id},
            { $set: {password: hash} }
        )

        if (reset.modifiedCount !== 1) {
            return res.status(401).json({
                success: false,
                message: "failed"
            })
        }

        res.status(201).json({
            success: true,
            message: "reset successful"
        })
    } catch (e) {
        res.status(500).json({
            success: false,
            message: "server error"
        })
    }
}

async function resetname(name, email, id, dont = null, req, res) {
    try {
        const username = name.split(" ")[0]
        
        const mailer = await user.findByIdAndUpdate(
            id,
            { $set: { name: name } },
            { $set: { username: username } },
            { new: true, runValidators: true }
        )

        if (!mailer) {
            return res.status(401).json({
                success: false,
                message: "reset failed"
            })
        }

        if (dont === null) return

        res.clearCookie('DZRT');

        const checkUser = await user.findOne({$or: [{email}]})
        
        if (!checkUser) {
            return res.status(400).json({
                success: false,
                message: "invalid details"
            })
        }

        const accessT = signAccessToken(checkUser)
        const refreshT = signRefreshToken(checkUser)

        res.cookie("DZRT", refreshT, {
            httpOnly: true,
            secure: true, // change to true when finished
            sameSite: "none",
            path: "/",
            maxAge: 365 * 24 * 60 * 60 * 1000
        })
        
        res.status(200).json({
            success: true,
            message: "successfull",
            token: accessT,
        })
    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message
        })
    }
}
async function resetEmail(e, id, dont, req, res) {
    try {
        const ifemail = await emailValidator(e)
        if (!ifemail.ok) {
            return res.status(400).json({
                success: false,
                message: ifemail.details
            })
        }

        const mailer = await user.findByIdAndUpdate(
            id,
            { $set: { email: e } },
            { new: true, runValidators: true }
        )

        if (!mailer) {
            return res.status(401).json({
                success: false,
                message: "reset failed"
            })
        }

        if (dont === null) return

        res.clearCookie('DZRT');

        const checkUser = await user.findOne({$or: [{email: e}]})
        
        if (!checkUser) {
            return res.status(400).json({
                success: false,
                message: "invalid details"
            })
        }

        const accessT = signAccessToken(checkUser)
        const refreshT = signRefreshToken(checkUser)

        res.cookie("DZRT", refreshT, {
            httpOnly: true,
            secure: true, // change to true when finished
            sameSite: "none",
            path: "/",
            maxAge: 365 * 24 * 60 * 60 * 1000
        })

        res.status(200).json({
            success: true,
            message: "successfull",
            token: accessT,
        })
    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message
        })
    }
}

export { resetData, passwordResetEmail, resetPassword }