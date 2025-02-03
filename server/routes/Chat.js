import express from 'express'
import sequelize from '../database.js'
import { FetchUsers } from '../controllers/ChatController.js'

const ChatRouter = express.Router()

ChatRouter.get('/show',FetchUsers)

export default ChatRouter