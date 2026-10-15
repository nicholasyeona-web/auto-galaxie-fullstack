// Usage: npm run seed          -> inserts the starter cars if the collection is empty
//        npm run seed -- --reset -> wipes cars first, then inserts
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Car = require("./models/Car");

const CARS = [
    { name: "Peugeot 208 GT", type: "Hatchback", fuel: "Gasoline", year: 2023, km: 12400, price: 18900, color: "#e0472c", hp: 130, seats: 5, desc: "Sporty hatchback, EAT8 automatic gearbox, 17-inch alloy wheels, very well maintained." },
    { name: "Tesla Model 3", type: "Sedan", fuel: "Electric", year: 2022, km: 30100, price: 29500, color: "#2f6fed", hp: 283, seats: 5, desc: "491 km range, Autopilot included, fast-charging compatible." },
    { name: "BMW 3 Series Touring", type: "Wagon", fuel: "Diesel", year: 2021, km: 45800, price: 27200, color: "#8a8f99", hp: 190, seats: 5, desc: "Family wagon, leather seats, adaptive cruise control, full service history." },
    { name: "Dacia Duster", type: "SUV", fuel: "Gasoline", year: 2023, km: 8200, price: 16300, color: "#3f9e5c", hp: 130, seats: 5, desc: "Compact 4x2 SUV, high ground clearance, ideal first family vehicle." },
    { name: "Ford Mustang GT", type: "Sports Car", fuel: "Gasoline", year: 2020, km: 22000, price: 38900, color: "#e0472c", hp: 450, seats: 4, desc: "5.0L V8, active exhaust, Recaro interior, limited edition." },
    { name: "Renault Megane E-Tech", type: "Sedan", fuel: "Electric", year: 2024, km: 3500, price: 31400, color: "#2f6fed", hp: 220, seats: 5, desc: "Nearly new, 12-inch OpenR display, active manufacturer warranty." },
    { name: "Toyota RAV4 Hybrid", type: "SUV", fuel: "Hybrid", year: 2022, km: 26700, price: 28600, color: "#3f9e5c", hp: 222, seats: 5, desc: "Reliable hybrid, all-wheel drive, low fuel consumption." },
    { name: "Volkswagen Golf GTI", type: "Hatchback", fuel: "Gasoline", year: 2021, km: 33900, price: 23100, color: "#c9ccd2", hp: 245, seats: 5, desc: "Sport chassis, Race mode, full manufacturer service history." },
];
//stores the cars information -> api.js
(async () => {
    try {
        await connectDB();
        if (process.argv.includes("--reset")) await Car.deleteMany({});
        //
        const count = await Car.countDocuments();
        if (count > 0) {
            console.log(`Cars collection already has ${count} documents. Use --reset to replace them.`);
            //
        } else {
            await Car.insertMany(CARS);
            console.log(`Inserted ${CARS.length} cars.`);
        }
    } catch (err) {
        console.error(err.message);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
})();
