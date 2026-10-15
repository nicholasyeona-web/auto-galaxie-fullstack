const express = require("express");
const Cart = require("../models/Cart");
const asyncHandler = require("../utils/asyncHandler");
const router = express.Router();

router.get("/:owner", asyncHandler(async (req, res) => {
    const doc = await Cart.findOne({ owner: req.params.owner });
    res.json(doc ? doc.carIds : []);
}));

router.post("/:owner", asyncHandler(async (req, res) => {
    const carId = String(req.body.carId || "");
    if (!carId) return res.status(400).json({ error: "carId is required" });

    const doc = await Cart.findOneAndUpdate(
        //findOneAndUpdate() finds the owner's cart and updates it.
        { owner: req.params.owner },
        //gets the owner identifier from the URL.
        { $addToSet: { carIds: carId } },
        //$addToSet adds the ID only if it isn't already in the array.
        { new: true, upsert: true },
        //upsert: true creates a cart document if one doesn't exist.
    );
    res.json(doc.carIds); 
    //sends the updated list of IDs back to the frontend.
}));

router.delete("/:owner/:carId", asyncHandler(async (req, res) => {
    const doc = await Cart.findOneAndUpdate(
        { owner: req.params.owner },
        //gets the owner identifier from the URL
        { $pull: { carIds: req.params.carId } },
        { new: true }
    );
    res.json(doc ? doc.carIds : []);
}));

module.exports = router;
