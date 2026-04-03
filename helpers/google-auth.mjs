import dotenv from "dotenv"
dotenv.config()
import bcrypt from "bcryptjs";
import user from "../model/user.mjs";
import {signAccessToken, signRefreshToken} from './cookies.mjs'
import { OAuth2Client } from "google-auth-library";
// import {app} from '../downzilla.mjs'

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const Gcallback = async (req, res) => {
    console.log('gcallback called')
    try {
        const token = req.body.credential;
        console.log(token)
        if (!token)  {
            return res.status(404).json({
                success: false,
                message: "token not found"
            })
        }

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload()

        const name = payload["sub"];
        const email = payload["email"];
        const username = name.split(" ")[0]
        console.log(username)

        if (username) {
            const checkUser = await user.findOne({$or: [{username}, {email}]})
            console.log(checkUser)
            if (checkUser) {
                const accessT = signAccessToken(checkUser)
                const refreshT = signRefreshToken(checkUser)

                res.cookie("DZRT", refreshT, {
                    httpOnly: true,
                    secure: true, // change to true when finished
                    sameSite: "none",
                    path: "/",
                    maxAge: 365 * 24 * 60 * 60 * 1000
                })


                return res.status(200).json({
                    success: true,
                    message: "login success",
                    accessT
                })
            } else {
                const salt = await bcrypt.genSalt(10)
                const hash = await bcrypt.hash(username, salt)

                const newUser = await user.create({
                            name,
                            username,
                            email,
                            password: hash,
                            downloadHistory: [],
                            publicPost: []
                        })

                const accessT = signAccessToken(newUser)
                const refreshT = signRefreshToken(newUser)

                res.cookie("DZRT", refreshT, {
                    httpOnly: true,
                    secure: true, // change to true when finished
                    sameSite: "none",
                    path: "/",
                    maxAge: 365 * 24 * 60 * 60 * 1000
                })
                
                return res.status(201).json({
                    success: true,
                    message: "reqistered successfully",
                    accessT
                })
            }
        }

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "something whent wong"
        })
    }
}

export { Gcallback}