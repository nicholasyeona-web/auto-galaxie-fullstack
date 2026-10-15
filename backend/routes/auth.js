const express = require("express");
const bcrypt = require("bcryptjs");//hashes pass and compares during login
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
//pass errors from async functions to Express error handler
const router = express.Router();

const publicUser = (u) => ({ username: u.username, email: u.email, role: u.role });

router.post("/register", asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        //if any of the required fields were missing it'll return an erro message
        return res.status(400).json({ error: "Username, email and password are required" });
    }
    if (password.length < 6) {
        //if the pass it less than 6 characters it'll return an error message
        return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    try {
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({ username: username.trim(), email, password: passwordHash });
        //saves the new user to MongoDB with hashes password
        res.json(publicUser(user));
    } catch (err) {
        if (err.code === 11000) {
            const field = Object.keys(err.keyPattern || {})[0] || "account";
            //if the email or username already exists in the database it'll return an error message
            return res.status(409).json({ error: `An account with this ${field} already exists` });
        }
        throw err;
    }
}));

router.post("/login", asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password are required" });
    //if the email or pass are missing it'll return error message 
    const user = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (!user) return res.status(404).json({ error: "No account found, please sign up." });
    //if the email is not found in the database it'll return error message
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Incorrect email or password" });
    //if the pass is not match with the database it'll return error message
    res.json(publicUser(user));
}));

module.exports = router;
