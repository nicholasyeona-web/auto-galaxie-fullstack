const User = require("../models/User");
const asyncHandler = require("./asyncHandler");

module.exports = asyncHandler(async (req, res, next) => {
    const email = req.header("x-user-email");
    //gets the email from the request header
    if (!email) return res.status(401).json({ error: "Admin credentials required" });
    //if the email is missing it'll return an error message
    const user = await User.findOne({ email: String(email).toLowerCase().trim() });
    //searches for the user in the database using the email from the request header
    if (!user || user.role !== "admin") return res.status(403).json({ error: "Admin access required" });
    //if the user is not found or the role is not admin it'll return an error message
    req.adminUser = user;
    next();
});
