import express from 'express'
import  { sharedFeed, sharedHistory } from "../extra/PublicPath/Public.mjs"

let route = express.Router()

route.get("/feed/:pub", sharedFeed)

route.get("/private/:cid/:hid", sharedHistory)

export default route