import express from 'express'
import sequelize from '../database.js'
import { FetchUsers,FetchCurrentUser,FetchUsersWithChats,sendMessage } from '../controllers/ChatController.js'

const ChatRouter = express.Router()

ChatRouter.get('/show',FetchUsers)
ChatRouter.get('/getCurrentUser',FetchUsersWithChats)
ChatRouter.post('/sendMessage',sendMessage)

export default ChatRouter