import jwt from 'jsonwebtoken'

const auth = async (req, res, next) => {
    const token = req.headers['authorization']
    if (!token && token.split(" ")[1]) {
        return res.status(404).json({
            success: false,
            message: "token not found"
        })
    }
    const authToken = token.split(" ")[1]
    if (!authToken) {
        return res.status(401).json({
            success: false,
            message: "error authenticating please relogin"
        })
    }

    jwt.verify(authToken, process.env.JWT_TOKEN, (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: "error verifying token",
                err
            })
        }
        
        req.userInfo = user
        next()
    })
}

export {auth}