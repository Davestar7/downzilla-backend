import jwt from "jsonwebtoken";

const cookieBase = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 365 * 24 * 60 * 60 * 1000 
}

const clearTokens = (res) => {
    res.clearCookie("ADZT", {...cookieBase});
    res.clearCookie("RDZT", {...cookieBase});
}

const signAccessToken = (user) => jwt.sign(
    {
        name: user.name,
        username: user.username,
        email: user.email,
        id: user._id,
        downloadHistory: []
    }, process.env.JWT_TOKEN, {
        expiresIn: "4d" // change to 1d
    } 
)

const signRefreshToken = (user) => jwt.sign(
    {
        name: user.name,
        username: user.username,
        email: user.email,
        id: user._id,
        downloadHistory: []
    },
    process.env.JWT_REFRESH,
    {
        expiresIn: "365d"
    }
)

export {clearTokens, signAccessToken, signRefreshToken }