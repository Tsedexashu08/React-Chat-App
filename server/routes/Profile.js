import express from 'express'
import sequelize from '../database.js'
import { fileUploadMiddleware } from '../middleware/ProfileMiddleWare.js'
import { RegisterUser,Login } from "../controllers/ProfileController.js";


const ProfileRoute = express.Router()


ProfileRoute.post('/Register',fileUploadMiddleware,RegisterUser)
ProfileRoute.post('/Login',Login)

export default ProfileRoute

