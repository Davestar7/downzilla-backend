import archiver from "archiver"
import crypto from "crypto"

const start = async (req, res) => {
    const {url, type} = req.body
    const resp = await fetch(process.env.STARTPATH, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({url, type})
    })
    const response = await resp.json()
    const id = response.data

    res.status(200).json({
        success: true,
        data: id
    })
}

const ytdown = async(req, res) => {
    let {id, ifTime = null} = req.body;
    
    console.log(`id: ${id}`)

    let time = ifTime

    if (ifTime != null) {
        time = 1080000
    }

    // const arg = ["--dump-single-json", "--flat-playlist","--no-warnings", "--ignore-error", "--no-call-home", "--no-cache-dir", url]
    const arg = ["-j", "-S", "+size, +br", "--no-warnings", "--skip-download", "--no-check-certificate", "--no-playlist", "--force-ipv4", "--retries", "infinite", "--fragment-retries", "infinite", "--ignore-errors", "--no-cache-dir"]

    try {
        const infos = await fetch(process.env.METADATAPATH, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({time: time, id: id, arg: arg})
        })
        const info = await infos.json()

        if (infos.status == 200) {
            res.status(200).json({
                    success: true,
                    message: "success",
                    conditional: true,
                    data: info.data
                })
        } else {
            res.status(infos.status).json({
                success: false,
                message: info.message
            })
        }
            
    } catch (error) {
        const err = error || "server error" 
       
        if (err == "server error") {
            res.status(500).json({
                success: false,
                message: error || "server error",
                conditional: false
            })
        } else {
            res.status(500).json({
                success: false,
                message: error || "server error",
                conditional: true
            })
        }
    }
    
}

const ytlist = async (req, res) => {
    const {id} = req.body;
    const myJob = jobs.get(id)
    if (!myJob || myJob.state !== "created") {
        return res.status(404).json({
            success: false,
            message: "process not found"
        })
    }
    const url = myJob.url

    console.log(`sent url ${url}`)
    if (!url) {
        myJob.state = "failed"
        jobs.delete(id)
        return res.status(400).json({
            success: false,
            message: "url not found",
        })
    }

    const args = ["-J", "--flat-playlist", "--no-warnings", "--dump-single-json", url]

    try {
        const info = await getVideoInfo(args, "playlist", null);
        myJob.state = "completed"
        jobs.delete(id)
        res.status(200).json({
            success: true,
            data: info
        });
    } catch (err) {
        myJob.state = "failed"
        jobs.delete(id)
        console.error("Error getting playlist info:", err);
        res.status(500).json({ 
            success: false,
            message: "playlist " + err
         });
    }
}

const cancel = async (req, res) => {
    const body = req.body

    const job = body.id
    const resp = await fetch(process.env.CANCELPATH, {
        method: "POST",
        header: {"Content-Type": "application/json"},
        body: JSON.stringify({id: job})
    })
    const resj = await resp.json()
    if (job) {
        if (resp.status && resp.status !== 200) {
            return res.status(res.status).json({
                success: false,
                message: resj.message
            })
        } else if (resp.status && resp.status === 200) {
            return res.status(res.status).json({
                success: true,
                message: resj.message
            })
        }
    }

}

export {start, cancel, ytdown, ytlist}