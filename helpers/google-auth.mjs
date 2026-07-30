import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import user from "../model/user.mjs";
import { signAccessToken, signRefreshToken } from "./cookies.mjs";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const Gcallback = async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({
                success: false,
                message: "Google credential not provided."
            });
        }

        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        if (!payload) {
            return res.status(401).json({
                success: false,
                message: "Invalid Google token."
            });
        }

        console.log("Google Payload:", payload);

        const name = payload.name;
        const email = payload.email;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Google account has no email."
            });
        }

        const username = name
            ? name.split(" ")[0]
            : email.split("@")[0];

        let currentUser = await user.findOne({
            $or: [
                { email }
            ]
        });

        if (!currentUser) {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(username, salt);

            currentUser = await user.create({
                name,
                username,
                email,
                password: hash,
                downloadHistory: [],
                publicPost: []
            });
        }

        const accessT = signAccessToken(currentUser);
        const refreshT = signRefreshToken(currentUser);

        res.cookie("DZRT", refreshT, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
            maxAge: 365 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: currentUser.createdAt ? "Authentication successful." : "Login successful.",
            accessT
        });

    } catch (err) {
        console.error("Google OAuth Error:", err);

        return res.status(500).json({
            success: false,
            message: err.message || "Internal server error."
        });
    }
};

export { Gcallback };
