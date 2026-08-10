import user from "../../model/user.mjs"
import feed from "../../model/feeds.mjs"

const escapeHtml = (str = "") =>
    String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

const sharedFeed = async (req, res) => {
    const id = req.params.pub;

    if (!id) {
        return res.status(400).send(`<em>Content not found</em>`);
    }

    try {
        const result = await feed.findById(id).lean();
        if (!result) {
            return res.status(404).send(`<em>404 Content not found</em>`);
        }

        const title = escapeHtml(result.title?.slice(0, 60));
        const description = escapeHtml(result.description?.slice(0, 170));
        const image = result.cloudinaryurl || "https://downzilla.buzz/large.png";
        const url = `https://downzilla.buzz/user/RenderFeed/${id}`;

        // Detect crawlers/bots — serve them the tags with NO redirect
        const ua = req.get("User-Agent") || "";
        const isBot = /bot|crawl|spider|facebookexternalhit|twitterbot|slackbot|whatsapp|telegrambot|discordbot|linkedinbot|embedly|quora link preview|pinterest|vkshare|w3c_validator|google|bing/i.test(ua);

        res.set("Content-Type", "text/html");

        res.status(200).send(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>${title} - downzilla</title>
            <link rel="shortcut icon" href="/large.png" type="image/x-icon">
            <meta property="og:title" content="${title}" />
            <meta property="og:description" content="${description}" />
            <meta property="og:image" content="${image}" />
            <meta property="og:url" content="${url}" />
            <meta property="og:type" content="website" />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="${title}" />
            <meta name="twitter:description" content="${description}" />
            <meta name="twitter:image" content="${image}" />

            <meta name="description" content="${description}" />
            <link rel="canonical" href="${url}" />

            ${!isBot ? `<script>window.location.replace(${JSON.stringify(url)});</script>` : ""}
          </head>
          <body>downzilla loading...</body>
          </html>
        `);
    } catch (e) {
        res.status(500).send(`<em>${escapeHtml(e.message)}</em>`);
    }
};

const sharedHistory = async (req, res) => {
    const id = req.params.cid;
    const hisid = req.params.hid;

    if (!id || !hisid) {
        return res.status(400).send(`<em>Content not found</em>`);
    }

    try {
        const resp = await user.findOne(
            { _id: id, "downloadHistory._id": hisid },
            { "downloadHistory.$": 1 }
        ).lean();

        const item = resp?.downloadHistory?.[0] || null;

        if (!item) {
            return res.status(404).send(`<em>404 Content not found</em>`);
        }

        const title = escapeHtml(item.title?.slice(0, 60));
        const description = escapeHtml(item.description?.slice(0, 170));
        const image = item.cloudinaryUrl || "https://downzilla.buzz/large.png";
        const url = `https://downzilla.buzz/user/user/shared/${id}/${hisid}`;

        const ua = req.get("User-Agent") || "";
        const isBot = /bot|crawl|spider|facebookexternalhit|twitterbot|slackbot|whatsapp|telegrambot|discordbot|linkedinbot|embedly|quora link preview|pinterest|vkshare|w3c_validator|google|bing/i.test(ua);

        res.set("Content-Type", "text/html");

        res.status(200).send(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>${title} - downzilla</title>
            <link rel="shortcut icon" href="/large.png" type="image/x-icon">
            <meta property="og:title" content="${title}" />
            <meta property="og:description" content="${description}" />
            <meta property="og:image" content="${image}" />
            <meta property="og:url" content="${url}" />
            <meta property="og:type" content="website" />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="${title}" />
            <meta name="twitter:description" content="${description}" />
            <meta name="twitter:image" content="${image}" />

            <meta name="description" content="${description}" />
            <link rel="canonical" href="${url}" />

            ${!isBot ? `<script>window.location.replace(${JSON.stringify(url)});</script>` : ""}
          </head>
          <body>downzilla loading...</body>
          </html>
        `);
    } catch (e) {
        res.status(500).send(`<em>${escapeHtml(e.message)}</em>`);
    }
};

export { sharedFeed, sharedHistory }
