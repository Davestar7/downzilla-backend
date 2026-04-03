import {autoLogin} from '../middleware/authenicator.mjs';
import {auth} from '../middleware/authmiddleware.mjs'
import { Gcallback} from '../helpers/google-auth.mjs'
import {usersignIn, userlogin, refreshT, protectedR, logout} from '../middleware/loginSignin.mjs'
import express from 'express';
const route = express.Router()

route.post('/signin', usersignIn)

route.post('/login', userlogin)

route.post('/refreshtoken', refreshT)

route.get('/protectedroute', auth, protectedR)

route.get('/logout', logout)

route.get('/auto', auth, protectedR)

// route.get('/googleauth/google', authG)

route.post('/googleauth/callback', Gcallback)

export default route