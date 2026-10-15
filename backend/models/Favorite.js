const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    owner: { type: String, required: true, unique: true },
    //identifies the favorites list
    carIds: { type: [String], default: [] },//begin empty
    //contains the Ids of saved cars
});

module.exports = mongoose.model("Favorite", schema);
//-> Favorites.jsx