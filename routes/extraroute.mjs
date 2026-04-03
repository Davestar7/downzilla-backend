import TandC from "../extra/tandc.mjs";
import policy from "../extra/privacy.mjs";
import isactive from "../extra/isactive.mjs";
import express from 'express'
const route = express.Router()

route.get("/tandc", TandC)

route.get("/policy", policy)

route.get("/connect", isactive)

export default route
