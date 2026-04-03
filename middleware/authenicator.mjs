import jwt from "jsonwebtoken"

let userInfo;

const autoLogin = (req, res) => {
    const token = req.params.id

    if (!token) {
        return res.status(400).json({
            success: false,
            message: "token error, please login again"
        })
    }

    const decodedTokenV = jwt.verify(token, process.env.JWT_TOKEN)

    userInfo = decodedTokenV
    console.log(userInfo)

    res.status(200).json({
        success: true,
        message: "login success",
        data: decodedTokenV
    })

}

const loginMiddleware = (req, res, next) => {
    req.userInfo = userInfo
}

export {autoLogin, loginMiddleware}