import sequelize from "../database.js";
import User from "../models/User.js";

export const RegisterUser = async (req, res) => {
    try {
        const { username, email, password, profile_picture, Tel } = req.body;

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

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const Login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        // Check if user exists and password matches
        const user = await User.findOne({ where: { username } });

        if (user && user.password === password) {
            res.status(200).json({ message: "Login successful" ,user_id:user.user_id,profile_picture: user.profile_picture});
        } else {
            res.status(400).json({ error: "Invalid username or password" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const FetchUser = async (req, res) => {
    try {
        const userId = req.params.id; 
        const currentUser = await User.findOne({ where: { user_id: userId } });
        res.status(200).json(currentUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}