

import express from 'express'
import sequelize from '../database.js'
import { fileUploadMiddleware } from '../middleware/ProfileMiddleWare.js'
import { RegisterUser, Login, FetchUser } from "../controllers/ProfileController.js"

const ProfileRoute = express.Router()

// Fix: Route parameter should use : instead of {}
ProfileRoute.post('/Register', fileUploadMiddleware, RegisterUser)
ProfileRoute.post('/Login', Login)
ProfileRoute.get('/getUser/:id', FetchUser)

export default ProfileRoute


