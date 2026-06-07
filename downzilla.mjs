import dotenv from "dotenv"
import express from 'express';
const app = express()
import cors from 'cors'
import checkUrlQ from './routes/urlQurey.mjs'
import auth from './routes/authRouts.mjs'
import conncttoDB from './db/dbconnection.mjs'
import cookieParser from 'cookie-parser'
import bodyParser from "body-parser";
import extras from "./routes/extraroute.mjs";
import sharedLink from "./routes/share.mjs"
// import feedbackdb from "./db/feedbackdb.mjs"
// import passport from 'passport'

dotenv.config()
const origin = [
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "https://downzilla.netlify.app",
    "https://www.downzilla.buzz",
    "https://downzilla.buzz"
]

app.use(cors({
    origin: origin,
    credentials: true
}))
app.use(express.json())
// app.use(express.json({ limit: "6mb" }))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use('/qurery/', checkUrlQ)
app.use('/auth/', auth)
app.use("/extra/", extras)
app.use("/shared", sharedLink)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});
app.get("/", (req, res) => {
   var title = 'Downzilla - Download Videos Instantly'
   var description = 'download from over 200+ streaming sites for free online at ease with downzilla and be able to share videos'
   var thumbnailUrl = '/large.png'
   var siteUrl = 'https://downzilla.buzz';

   res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="google-site-verification" content="0tgfcaCnyFS7d3sh4-7Pna5FB-x1wXgkNorAOQVoR1M" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <link rel="canonical" href="${siteUrl}" />

  <!-- Open Graph (Facebook, LinkedIn, Discord, WhatsApp, Telegram) -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${siteUrl}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${thumbnailUrl}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content="Downzilla" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${thumbnailUrl}" />

  <!-- Redirect for real users (bots will stop at the meta tags above) -->
  <script>
    const bots = /bot|crawl|slurp|spider|facebookexternalhit|twitterbot|linkedinbot|discordbot|whatsapp|telegram/i;
    if (!bots.test(navigator.userAgent)) {
      window.location.replace('${siteUrl}');
    }
  </script>
</head>
<body>
  <a href="${siteUrl}">Go to Downzilla</a>
</body>
</html>`);
})
await conncttoDB()

const keepAlive = () => {
  setInterval(async () => {
    try {
      const response = await fetch(
        `http://localhost:${process.env.PORT || 3000}/health`
      );
      console.log(`Heartbeat ✅ ${new Date().toISOString()}`);
    } catch (err) {
      console.error(`Heartbeat failed ❌ ${err.message}`);
    }
  }, 14 * 60 * 1000); // 14 minutes
};

export {app}

const port = process.env.PORT
console.log("running an andriod editor")
app.listen(port, () => {
    console.log(`server live at http://localhost:${port}`)
})