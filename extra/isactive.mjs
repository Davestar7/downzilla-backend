

const isactive = (req, res) => {
    res.status(200).json({
        success: true,
        message: "connected"
    })
}

export default isactive