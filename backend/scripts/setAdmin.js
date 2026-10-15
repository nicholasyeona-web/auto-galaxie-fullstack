require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");

const email = process.argv[2];
//reads the email supplied after the script filename.
if (!email) {
    console.error("Usage: node scripts/setAdmin.js someone@example.com");
    process.exit(1);
}

(async () => {
    try {
        await connectDB();
        const user = await User.findOneAndUpdate(
            //searches for a user with that email.
            { email: email.toLowerCase().trim() },
            { role: "admin" },
            { new: true },
            //returns the updated user document.
        );
        if (!user) {
            console.log("No account found with that email. Register it in the app first, then rerun this.");
        } else {
            console.log(`${user.email} is now an admin.`);
        }
    } catch (err) {
        console.error(err.message);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
})();
