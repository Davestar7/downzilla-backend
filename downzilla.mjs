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
   res.send(`hello downzilla here - <a href="https://downzilla.netlify.app">Home</a>`)
})
await conncttoDB()

export {app}

const port = process.env.PORT
console.log("running an andriod editor")
app.listen(port, () => {
    console.log(`server live at http://localhost:${port}`)
})