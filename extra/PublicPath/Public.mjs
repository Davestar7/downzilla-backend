import user from "../../model/user.mjs"
import feed from "../../model/feeds.mjs"

const sharedFeed = async(req, res) => {
    const id = req.params.pub
    
    if (!id) {
        return res.status(400).send(`<em>Content not found</em>`)
    }
    try{
        const result = await feed.findById(id).lean()
        if (!result) {
            return res.status(401).send(`em>404 Content not found</em>`)
        }
        
        const tit = result.title
        const descriptions = result.description
        const image = result.cloudinaryurl || "../../large.png"
        const url = `https://downzilla.buzz/user/RenderFeed/${id}`;
       
        const title = tit?.slice(0, 60);
        const description = descriptions?.slice(0, 170);
    
        res.set("Content-Type", "text/html");
    
        res.status(200).send(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>${title} - downzilla</title>
            <link rel="shortcut icon" href="../large.png" type="image/x-icon">
            <meta property="og:title" content="${title}" />
            <meta property="og:description" content="${description}" />
            <meta property="og:image" content="${image}" />
            <meta property="og:url" content="${url}" />
            <meta property="og:type" content="website" />
    
            <!-- Twitter -->
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="${title}" />
            <meta name="twitter:description" content="${description}" />
            <meta name="twitter:image" content="${image}" />

            <meta name="description" content="${description}" />
            <link rel="canonical" href="${url}" />
    
            <meta http-equiv="refresh" content="1;url=${url}" />
          </head>
             <body>downzilla loading...</body>
          </html>
        `);
    
    } catch (e) {
        res.status(500).send(`em>${e.message}</em>`)
    }
}

const sharedHistory = async(req, res) => {
    const id = req.params.cid 
    const hisid = req.params.hid 
    
    if (!id || !hisid) {
        return res.status(400).send(`<em>Content not found</em>`)
    }
    
    try {
        const resp = await user.findOne(
          { _id: id, "downloadHistory._id": hisid },
          { "downloadHistory.$": 1 }
        ).lean();
        
        const item = resp?.downloadHistory?.[0] || null;
        
        if (!item) {
          return res.status(401).send(`<em>404 Content not found</em>`)
        }
        
        const tit = item.title
        const image = item.cloudinaryUrl || "../../large.png"
        const descriptions = item.description
        const url = `https://downzilla.buzz/user/user/shared/${id}/${hisid}`;
        
        const title = tit?.slice(0, 60);
        const description = descriptions?.slice(0, 170);
        
          res.status(200).send(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>${title} - downzilla</title>
              <link rel="shortcut icon" href="../large.png" type="image/x-icon">
              <meta property="og:title" content="${title}" />
              <meta property="og:description" content="${description}" />
              <meta property="og:image" content="${image}" />
              <meta property="og:url" content="${url}" />
              <meta property="og:type" content="website" />
      
              <!-- Twitter -->
              <meta name="twitter:card" content="summary_large_image" />
              <meta name="twitter:title" content="${title}" />
              <meta name="twitter:description" content="${description}" />
              <meta name="twitter:image" content="${image}" />
    
              <meta name="description" content="${description}" />
              <link rel="canonical" href="${url}" />
      
              <meta http-equiv="refresh" content="1;url=${url}" />
            </head>
      
            <body>downzilla loading...</body>
          </html>`);
          
    } catch (e) {
        res.status(500).send(`<em>${e.message}</em>`)
    }
}

export { sharedFeed, sharedHistory }
