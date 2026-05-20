
const start = async (req, res) => {
    const {url, type} = req.body
    
    if (!url || !type) {
        return res.status(404).json({
            success: false,
            message: "process not found"
        })
    }
    
    const resp = await fetch(process.env.STARTPATH, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({url: url, type: type})
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
    
    if (!id) {
        return res.status(404).json({
            success: false,
            message: "operation id not found"
        })
    }

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
    
    if (!id) {
        return res.status(404).json({
            success: false,
            message: "process not found"
        })
    }

    const args = ["-J", "--flat-playlist", "--no-warnings", "--dump-single-json"]

    try {
        const info = await fetch(process.env.METADATAPATH, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({id: id, time: null, arg: args})
        });
        const data = await info.json()
        if (info.status != 200) {
            return res.status(info.status).json({
                success: false,
                message: data.message
            })
        }

        res.status(200).json({
            success: true,
            data: data.data
        });
    } catch (err) {
        res.status(500).json({ 
            success: false,
            message: "Fetching playlist Error: " + err
        });
    }
}

const cancel = async (req, res) => {
    const id = req.body.id
    
    if (!id) {
        return res.status(404).json({
            success: false,
            message: "process not found"
        })
    }

    try {
        const resp = await fetch(process.env.CANCELPATH, {
            method: "GET",
            headers: {"Content-Type": "application/json", "x-operation-id": `${id}`}
        })
        
        const resj = await resp.json()
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
    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message + " :occured while processing"
        })
    }

}

export {start, cancel, ytdown, ytlist}