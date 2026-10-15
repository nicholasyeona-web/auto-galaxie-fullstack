const express = require("express");
const Order = require("../models/Order");
const Car = require("../models/Car");
const Cart = require("../models/Cart");
const asyncHandler = require("../utils/asyncHandler");
const router = express.Router();

// POST /api/checkout/place-order   { owner }
// No external payment gateway — builds the order straight from the owner's
// current cart and marks it placed immediately, then empties the cart.
router.post(
    "/place-order",
    asyncHandler(async (req, res) => {
        const { owner } = req.body;
        if (!owner) return res.status(400).json({ error: "owner is required" });

        const cartDoc = await Cart.findOne({ owner });
        const carIds = cartDoc ? cartDoc.carIds : [];
        //If the cart exists, carIds becomes its list of car IDs. If it doesn't exist, carIds becomes an empty array.
        if (carIds.length === 0) return res.status(400).json({ error: "Your cart is empty" });

        const cars = await Car.find({ _id: { $in: carIds } });
        if (cars.length === 0) return res.status(400).json({ error: "Vehicles in your cart could not be found" });

        const order = await Order.create({//for order
            owner,//identifies
            items: cars.map((c) => ({ carId: c._id, name: c.name, price: c.price })),
            total: cars.reduce((sum, c) => sum + c.price, 0),
            status: "paid",
            //creates order with paid immediately without real payment
        });

        await Cart.findOneAndUpdate({ owner }, { carIds: [] });

        res.status(201).json(order);
        //-> Order.js
    }),
);

module.exports = router;
