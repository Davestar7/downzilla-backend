import dotenv from "dotenv"
import express from 'express';
const app = express()
import cors from 'cors'
import checkUrlQ from './routes/urlQurey.mjs'
import auth from './routes/authRouts.mjs'
import conncttoDB from './db/mongoDB.mjs'
import cookieParser from 'cookie-parser'
import bodyParser from "body-parser";
import extras from "./routes/extraroute.mjs";
// import passport from 'passport'

dotenv.config()
const origin = [
    "http://127.0.0.1:5500",
    "http://localhost:5500"
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
await conncttoDB()

export {app}

const port = process.env.PORT

app.listen(port, () => {
    console.log(`server live at http://localhost:${port}`)
})