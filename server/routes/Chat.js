import express from 'express'
import sequelize from '../database.js'
import { FetchUsers,FetchUser,FetchUsersWithChats,sendMessage,StartChat,FetchChatMessages,FetchLastChat } from '../controllers/ChatController.js'

const ChatRouter = express.Router()

ChatRouter.get('/show',FetchUsers)
ChatRouter.get('/getCurrentUser',FetchUsersWithChats)
ChatRouter.post('/sendMessage',sendMessage)
ChatRouter.post('/StartChat',StartChat)
ChatRouter.post('/getUser',FetchUser)
ChatRouter.post('/fecthMessages',FetchChatMessages)
ChatRouter.post('/fetchLastChat', FetchLastChat)

export default ChatRouter