const express = require("express");
const mongoose = require("mongoose");
const Car = require("../models/Car");
const asyncHandler = require("../utils/asyncHandler");
const requireAdmin = require("../utils/requireAdmin");
const router = express.Router();

// A photo is mandatory whenever a vehicle is added or edited.
const hasPhoto = (body) => typeof body.image === "string" && body.image.trim() !== "";

router.get(
    "/",
    asyncHandler(async (req, res) => {
        //getting all the cars from the database
        const cars = await Car.find().sort({ _id: 1 });
        //sorts the results by ID in ascending order.

        res.json(cars);
        //sends the cars back to the frontend as JSON
    }),
);

router.get(
    "/:id",
    asyncHandler(async (req, res) => {
        //get one cars
        if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: "Vehicle not found" });
        const car = await Car.findById(req.params.id);
        if (!car) return res.status(404).json({ error: "Vehicle not found" });
        res.json(car);
    }),
);

router.post(
    "/",
    requireAdmin,
    asyncHandler(async (req, res) => {
        //checks admin permission
        //add a new car
        if (!hasPhoto(req.body)) return res.status(400).json({ error: "A photo is required to add a vehicle" });
        //req.body contains the data sent by the frontend
        //hasPhoto() checks that the car have photo , req.body contain the data sent by frontend
        const car = await Car.create(req.body);
        //saves the new car to MongoDB.
        res.status(201).json(car);
    }),
);

router.put(
    "/:id",
    requireAdmin,
    asyncHandler(async (req, res) => {
        //update or edit a car
        if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: "Vehicle not found" });
        //req.params.id contains the car's ID from the URL
        if (!hasPhoto(req.body)) return res.status(400).json({ error: "A vehicle must have a photo" });
        //check the cars have photo or not and contain the data sent by the frontend
        const car = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!car) return res.status(404).json({ error: "Vehicle not found" });
        //all successful the backend will updates the mongoDB record
        //and the frontend will replaces the old car object
        res.json(car);
        //setCars <-
    }),
);

router.delete(
    "/:id",
    requireAdmin,
    asyncHandler(async (req, res) => {
        //checks admin permission
        //delete a car
        if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: "Vehicle not found" });
        const car = await Car.findByIdAndDelete(req.params.id);
        //then delete the record
        if (!car) return res.status(404).json({ error: "Vehicle not found" });
        res.json({ success: true });
        //then the frontend removes the car from its state
        //setCars<-
    }),
);

module.exports = router;
