const mongoose = require("mongoose");

const MAX_YEAR = new Date().getFullYear() + 1;
const wholeNumber = { validator: Number.isInteger, message: "{PATH} must be a whole number" };
//a whole number number without a decimal part no ..

const carSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, maxlength: [60, "Name can't be longer than 60 characters"] },
        type: { type: String, required: true, trim: true, maxlength: [30, "Type can't be longer than 30 characters"] },
        fuel: { type: String, required: true, trim: true, maxlength: [20, "Fuel can't be longer than 20 characters"] },
        year: {
            type: Number,
            required: true,
            validate: wholeNumber,
            min: [1950, "Year can't be earlier than 1950"],
            max: [MAX_YEAR, `Year can't be later than ${MAX_YEAR}`],
        },
        km: {
            type: Number,
            required: true,
            min: [0, "Mileage can't be negative"],
            max: [1000000, "Mileage can't be more than 1,000,000 km"],
        },
        price: {
            type: Number,
            required: true,
            min: [1, "Price must be at least 1 €"],
            max: [10000000, "Price can't be more than 10,000,000 €"],
        },
        color: { type: String, default: "#8a8f99", match: [/^#[0-9a-fA-F]{6}$/, "Color must be a hex value like #8a8f99"] },
        hp: {
            type: Number,
            required: true,
            validate: wholeNumber,
            min: [1, "Horsepower must be at least 1"],
            max: [3000, "Horsepower can't be more than 3,000"],
        },
        seats: {
            type: Number,
            required: true,
            validate: wholeNumber,
            min: [1, "Seats must be at least 1"],
            max: [9, "Seats can't be more than 9"],
        },
        desc: { type: String, default: "", maxlength: [500, "Description can't be longer than 500 characters"] },
        image: { type: String, default: null },
    },
    {
        timestamps: true,
        toJSON: {//this is how mongoose represented when converted to JSON
            versionKey: false,
            transform: (_doc, ret) => {//doc is the original mongoose document
                //ret is the plain object prepared for JSON output
                ret.id = ret._id.toString();
                //indentifier and converts into string
                delete ret._id;
                delete ret.createdAt;
                delete ret.updatedAt;
                return ret;
                //returns the modified object
            },
        },
    }
);

module.exports = mongoose.model("Car", carSchema);
