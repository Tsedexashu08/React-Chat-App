import { DataTypes } from "sequelize";
import sequelize from "../database.js"



const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    profile_picture: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true, // Validate email format
        },
    },
    Tel: {
        type: DataTypes.STRING, // Use STRING for phone numbers
        allowNull: false,
        validate: {
            isNumeric: true, // Correctly use isNumeric
            len: {
                args: [10, 15], // Ensure the phone number length is between 10 and 15 digits
                msg: 'Tel must be between 10 and 15 digits.'
            }
        }
    }
    ,
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    // Additional options
    timestamps: true, // Automatically manage createdAt and updatedAt
});

export default User