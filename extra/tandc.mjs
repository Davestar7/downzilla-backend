import { promises } from "dns"
import fs from "fs"

const TandC = (req, res) => {
    try {
        fs.readFile("extra/textData/tandc.txt", "utf8", (err, data) => {
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
                message: "terms and conditions",
                head,
                body
            })
        })
    } catch (e) {
        res.status(500).json({
            success: false,
            message: "server Error" + e.message
        })
    }
}

export default TandC