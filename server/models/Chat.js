import { DataTypes } from "sequelize";
import sequelize from "../database.js";


const Chat = sequelize.define('Chat', {
    chat_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id_1: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'user_id',
        },
        onDelete: 'CASCADE',
    },
    user_id_2: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'user_id',
        },
        onDelete: 'CASCADE',
    },
}, {
    tableName: 'Chat',
    timestamps: true,
});

export default Chat