import fs from "fs"

const privacy = (req, res) => {
    const text = fs.readFile("extra/textData/privacy.txt", "utf8", (err, data) => {
        if (err) {
            res.status(500).json({
                success: false,
                message: "an error occured on the server"
            })
            console.log(err)
            return
        }

        const text = data.split(".")
        const head = text[0].toString().toUpperCase()
        const body = []
        text.forEach((t, i) => {
            if (i === 0) {
                return
            }

            body.push(t.toString())
        })

        res.status(200).json({
            success: true,
            message: "downzilla privacy policy",
            head,
            body
        })
    })
}

export default privacy