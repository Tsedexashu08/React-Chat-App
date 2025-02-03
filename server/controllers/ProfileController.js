import sequelize from "../database.js";
import User from "../models/User.js";

export const RegisterUser = async (req, res) => {
    try {
        const { username, email, password, profile_picture, Tel} = req.body;

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }
        // Create new user
        const newUser = await User.create({ username, email, password, profile_picture, Tel });

        // Send response
        res.status(201).json({ message: "User registered successfully", user: newUser });
    // Redirect to another route
    // res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}