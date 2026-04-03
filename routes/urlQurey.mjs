import express from 'express'
import {findFromDB} from '../middleware/rendermiddleware.mjs'
import {start, cancel, ytdown, ytlist} from '../helpers/download.mjs'
import {returnData, uploadData} from "../helpers/downloadfeed.mjs"
import { toHistory, getHistory, getSingleHistory, removeHistory } from '../helpers/userQ.mjs'

let route = express.Router()

route.get('/render/:id', findFromDB)

route.post("/start", start)

route.post("/cancel", cancel)

route.post("/getdata", ytdown)

route.post("/playlist", ytlist)

route.post("/uploaddata", uploadData)

route.get("/getfeed", returnData)

route.post("/uploadhistory", toHistory)

route.post("/gethistory", getHistory)

route.post("/getSH", getSingleHistory)

route.post("/deletehistory", removeHistory)

export default route