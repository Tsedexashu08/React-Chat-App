import { DataTypes } from "sequelize";
import sequelize from "../database.js";


const Chat_Messages = sequelize.define('Chat_Messages', {
    chat_message_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    chat_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Chat',
            key: 'chat_id',
        },
        onDelete: 'CASCADE',
    },
    sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'user_id',
        },
        onDelete: 'CASCADE',
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    tableName: 'Chat_Messages',
    timestamps: true,
});

export default Chat_Messages  