require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/cars", require("./routes/cars"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/favorites", require("./routes/favorites"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/checkout", require("./routes/checkout"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/users", require("./routes/users"));

app.use((req, res) => res.status(404).json({ error: "Not found" }));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    // Bad input (too long, out of range, wrong format) is the caller's mistake: 400, not 500.
    if (err.name === "ValidationError") {
        const first = Object.values(err.errors)[0];
        //if the input is invalid it'll return an error message
        return res.status(400).json({ error: first ? first.message : "Invalid data" });
    }
    if (err.name === "CastError") {
        return res.status(400).json({ error: "One of the values is not valid" });
    }
    console.error(err);
    res.status(500).json({ error: "Server error" });
});

const PORT = process.env.PORT || 4000;

connectDB()
    .then(() => app.listen(PORT, () => console.log(`Auto Galaxie API listening on http://localhost:${PORT}`)))
    .catch((err) => {
        console.error("Failed to start:", err.message);
        process.exit(1);
    });
