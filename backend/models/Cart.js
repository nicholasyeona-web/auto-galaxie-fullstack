const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    owner: { type: String, required: true, unique: true },
    //Every cart must have an owner and Each owner should have one cart document.
    carIds: { type: [String], default: [] },
    //An array containing the IDs of cars in that cart.
});

module.exports = mongoose.model("Cart", schema);
