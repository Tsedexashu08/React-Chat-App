import express from 'express'
import sequelize from '../database.js'
import { fileUploadMiddleware } from '../middleware/ProfileMiddleWare.js'
import { RegisterUser } from "../controllers/ProfileController.js";


const ProfileRoute = express.Router()


ProfileRoute.post('/Register',fileUploadMiddleware,RegisterUser)

export default ProfileRoute

