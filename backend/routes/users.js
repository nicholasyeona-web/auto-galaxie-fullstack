const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const requireAdmin = require("../utils/requireAdmin");
const router = express.Router();

// All routes here are admin-only — this is account management, not a public directory.
router.use(requireAdmin);

// GET /api/users  -> every registered customer
router.get("/", asyncHandler(async (req, res) => {

    const users = await User.find().sort({ createdAt: -1 });
    //
    res.json(users);
}));

// DELETE /api/users/:id
// Note: there is no route to change a user's role. Admin access is only
// ever granted via the command-line scripts/setAdmin.js script — not
// through the web app — by design.
router.delete("/:id", asyncHandler(async (req, res) => {
    //sends a DELETE request to /api/users/:id
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: "Account not found" });
    if (String(req.params.id) === String(req.adminUser._id)) {
        return res.status(400).json({ error: "You can't delete your own account while logged in as it" });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "Account not found" });
    res.json({ success: true });
}));

module.exports = router;
