import user from "../model/user.mjs"
import jwt from "jsonwebtoken"
import bcryptjs from "bcryptjs"
import {clearTokens, signAccessToken, signRefreshToken } from '../helpers/cookies.mjs'
import { userInfo } from "os"

const usersignIn = async (req, res) => {
    try {
        const {name, email, password} = req.body
        const username = name.split(" ")[0]

        const verify = await user.findOne({$or: [{name}, {email}]})

        if (verify) {
            return res.status(400).json({
                success: false,
                message: "details already exist"
            })
        }

        const salt = await bcryptjs.genSalt(10)
        const hash = await bcryptjs.hash(password, salt)

        const newUser = await user.create({
            name,
            username,
            email,
            password: hash,
            downloadHistory: [],
            totalStars: 0,
            stared: []
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

        res.status(201).json({
            success: true,
            message: "reqistered successfully",
            accessT
        })

    } catch(e) {
        console.log(e)
        res.status(400).json({
            success: false,
            message: "something went wong when signing up, please try again",
            error: e
        })
    }
}

const userlogin = async (req, res) => {
    try {
        const {text, password} = req.body
        let username = text;
        let email = text
        
        const checkUser = await user.findOne({$or: [{username}, {email}]})
        
        if (!checkUser) {
            return res.status(400).json({
                success: false,
                message: "invalid login details"
            })
        }

        const comparePassword = await bcryptjs.compare(password, checkUser.password)
        console.log(comparePassword)
        if (!comparePassword) {
            return res.status(402).json({
                success: false,
                message: 'incorrect password'
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
            message: "loged in successfull",
            token: accessT,
        })
        console.log(req.cookies.DZRT)
    } catch (e) {
        res.status(400).json({
            success: false,
            message : "error occoured"
        })
    }
}

const refreshT = (req, res) => {
    const token = req.cookies.DZRT;
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "401 - token not found"
        })
    }

    jwt.verify(token, process.env.JWT_REFRESH, (err, user) => {
        if (err) return res.status(403).json({
            success: false,
            message: "something went wong"
        })

        const accessTr = signAccessToken(user)

        res.status(200).json({
            success: true,
            message: "refreshed tokens",
            accessT: accessTr,
        })
    })
}

const protectedR = (req, res) => {
    res.status(200).json({
        success: true,
        user: req.userInfo
    })
}

const logout = (req, res) => {
    res.clearCookie('DZRT');
    res.status(200).json({
        success: true,
        message: "logged out successfully"
    })
}

export {usersignIn, userlogin, refreshT, protectedR, logout}