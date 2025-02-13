import sequelize from "../database.js";
import User from "../models/User.js";
import Chat from "../models/Chat.js";
import Chat_Messages from "../models/ChatMessages.js";

export const FetchUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}
export const FetchUsersWithChats = async (req, res) => {
    try {
        const chats = await Chat.findAll({
            include: [
                { model: User, as: 'User1' }, // Include the first user
                { model: User, as: 'User2' }, // Include the second user
                { model: ChatMessages, as: 'Messages' } // Include messages associated with the chat
            ]
        });
        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const FetchUser = async (req, res) => {
    try {
        const userId = req.body.id; // Use req.body to get the ID
        const currentUser = await User.findOne({ where: { user_id: userId } });
        res.status(200).json(currentUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export const StartChat = async (req, res) => {
    try {
        const { user1Id, user2Id } = req.body;

        const chat = await Chat.findOne({
            where: {
                user_id_1: user1Id,
                user_id_2: user2Id
            }
        });

        if (chat) {
            return res.status(200).json({ chat_id: chat.chat_id });
        } else {
            const newChat = await Chat.create({
                user_id_1: user1Id,
                user_id_2: user2Id
            });
            return res.status(200).json({ chat_id: newChat.chat_id });
        }
    } catch (error) {
        console.error('Error in StartChat:', error.message);
        return res.status(500).json({ error: error.message });
    }
};

export const InitiateChat = async (user1Id, user2Id) => {
    try {
        const chat = await Chat.findOne({
            where: {
                user_id_1: user1Id,
                user_id_2: user2Id
            }
        });

        if (chat) {
            return { chatId: chat.chat_id };
        } else {
            const newChat = await Chat.create({
                user_id_1: user1Id,
                user_id_2: user2Id
            });
            return { chatId: newChat.chat_id }
        }
    } catch (error) {
        throw new Error(error.message);
    }
};


export const sendMessage = async (req, res) => {
    try {
        const { user1Id, user2Id, msgContent } = req.body;
        const chatResponse = await InitiateChat(user1Id, user2Id);
        const chatId = chatResponse.chatId;

        const newMessage = await Chat_Messages.create({
            chat_id: chatId,
            sender_id: user2Id,
            content: msgContent
        });

        res.status(201).json({ messageId: newMessage.id, chatId: chatId });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: error.message });
    }
};

export const FetchChatMessages = async (req, res) => {
    try {
        const {chatId} = req.body;
        const messages = await Chat_Messages.findAll({
            where: {
                chat_id: chatId
            }
        });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}