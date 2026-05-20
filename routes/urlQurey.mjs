import express from 'express'
import {start, cancel, ytdown, ytlist} from '../helpers/download.mjs'

import {returnData, uploadData, getSingleContent, searchContent} from "../helpers/downloadfeed.mjs"

// import {returnData, uploadData} from "../helpers/downloadfeed.mjs"
import { starContent, removeStar, getStaredContent, gettotalstars } from "../helpers/stars.mjs"

import { toHistory, getHistory, getSingleHistory, removeHistory } from '../helpers/userQ.mjs'

let route = express.Router()

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

route.post("/getContentData", getSingleContent)

route.post("/star", starContent)

route.post("/unstar", removeStar)

route.post('/stared', getStaredContent)

route.post('/searchContent', searchContent)

route.post('/totalstares', gettotalstars)

export default route