import express from "express";
import ProfileRoute from './routes/Profile.js';
import ChatRouter from "./routes/Chat.js";
import sequelize from "./database.js";
import User from "./models/User.js";
import Chat from "./models/Chat.js";
import ChatMessages from "./models/ChatMessages.js";
import Messages from "./models/Messages.js";
import { fileURLToPath } from 'url';
import path from 'path';
import http from "http";
import { Server } from "socket.io";
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000"
    }
});

app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/user', ProfileRoute);
app.use('/chat', ChatRouter);

// Define associations (relationships)
User.hasMany(Messages, { foreignKey: 'sender_id', as: 'SentMessages' });
User.hasMany(Messages, { foreignKey: 'receiver_id', as: 'ReceivedMessages' });
User.hasMany(Chat, { foreignKey: 'user_id_1', as: 'ChatsAsUser1' });
User.hasMany(Chat, { foreignKey: 'user_id_2', as: 'ChatsAsUser2' });
User.hasMany(ChatMessages, { foreignKey: 'sender_id', as: 'ChatMessages' });

Messages.belongsTo(User, { foreignKey: 'sender_id', as: 'Sender' });
Messages.belongsTo(User, { foreignKey: 'receiver_id', as: 'Receiver' });

Chat.belongsTo(User, { foreignKey: 'user_id_1', as: 'User1' });
Chat.belongsTo(User, { foreignKey: 'user_id_2', as: 'User2' });
Chat.hasMany(ChatMessages, { foreignKey: 'chat_id', as: 'Messages' });

ChatMessages.belongsTo(Chat, { foreignKey: 'chat_id', as: 'Chat' });
ChatMessages.belongsTo(User, { foreignKey: 'sender_id', as: 'Sender' });

const PORT = process.env.PORT || 3001;

const onlineUsers = new Map(); // Storing with socket id to track online status....? user_id -> socket.id mapping


const startServer = async () => {
    try {
        await sequelize.sync();
        console.log("Connection successful!");


        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });



        io.on('connection', (socket) => {
            console.log('A user connected:', socket.id);

            socket.on("user_connected", (userId) => {
                onlineUsers.set(userId, socket.id);
                // Broadcasting to all z clients that user is online
                io.emit("user_status", {
                    userId: userId,
                    status: "online"
                });
            });

            socket.on("join chat", (chatId) => {
                socket.join(chatId);
                console.log(`User ${socket.id} joined chat ${chatId}`);
            });

            socket.on('chat message', ({ chatId, msg }) => {
                const message = {
                    sender_id: socket.userId, // Include sender_id
                    content: msg,
                    timestamp: new Date().toISOString()
                };
                socket.to(chatId).emit('receive message', message);
                console.log(`Message sent to chat ${chatId}: ${msg}`);
            });
            // Handle disconnection
            socket.on('disconnect', () => {
                // Find user id associated with this socket
                let disconnectedUser;
                for (let [userId, socketId] of onlineUsers.entries()) {
                    if (socketId === socket.id) {
                        disconnectedUser = userId;
                        break;
                    }
                }

                if (disconnectedUser) {
                    onlineUsers.delete(disconnectedUser);
                    // Broadcast to all clients that user is offline
                    io.emit("user_status", {
                        userId: disconnectedUser,
                        status: "offline"
                    });
                }
                console.log('User disconnected:', socket.id);
            });
        });

    } catch (err) {
        console.error("Unable to connect to the database:", err);
    }
};

startServer();