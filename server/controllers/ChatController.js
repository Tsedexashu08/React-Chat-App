import sequelize from "../database.js";
import User from "../models/User.js";

export const FetchUsers = async (req,res) =>{
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}