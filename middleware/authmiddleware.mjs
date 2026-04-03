import jwt from 'jsonwebtoken'

const auth = async (req, res, next) => {
    const token = req.headers['authorization']
    const authToken = token && token.split(" ")[1]
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
        console.log(user)
        req.userInfo = user
        next()
    })
}

export {auth}