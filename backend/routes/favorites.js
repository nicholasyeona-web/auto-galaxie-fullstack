const express = require("express");
const Favorite = require("../models/Favorite");
const asyncHandler = require("../utils/asyncHandler");
const router = express.Router();

router.get(//react loads the app 
    "/:owner",//AppContext.jsx determines the current owner
    asyncHandler(async (req, res) => {//it request the saved favorites 
        const doc = await Favorite.findOne({ 
            //finds the owner's favorites document in MongoDB
            owner: req.params.owner 

        });

        res.json(doc ? doc.carIds : []);
        //if empty returns an empty array, or else return the list saved car IDs
    }),
); //Get favorite car IDs

router.post(
    "/:owner",
    asyncHandler(async (req, res) => {
        const { owner } = req.params;
        const carId = String(req.body.carId || "");
        if (!carId) return res.status(400).json({ error: "carId is required" });

        const doc =
            (await Favorite.findOne({ owner })) ||
            //Find the owner's favorites document.
            new Favorite({ owner });
        //If there isn't one, create a new document in memory.

        const i = doc.carIds.indexOf(carId);
        //Search for the car ID using indexOf().
        if (i >= 0) {
            doc.carIds.splice(i, 1);
            //If the ID exists, splice() removes it.
        } else {
            doc.carIds.push(carId);
            //Otherwise, push() adds it.
        }

        await doc.save();
        //save() stores the updated document in MongoDB.
        res.json(doc.carIds);
        //Return the new list of favorites.
    }),
); //Toggle a car's favorite status
//-> Favorite.js

module.exports = router;
