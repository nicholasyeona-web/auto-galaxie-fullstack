// =====================================================================
// models/Order.js
// "订单"的设计图：规定一张订单里要记录哪些信息，以及每项信息的规则。
// =====================================================================

const mongoose = require("mongoose"); // 借用 Mongoose：它负责让我们的代码和 MongoDB 数据库"对话"

const orderSchema = new mongoose.Schema(
    {
        owner: { type: String, required: true },
        items: [
            {
                carId: { type: mongoose.Schema.Types.ObjectId, ref: "Car" },
                name: String,
                price: Number,
            },
        ],

        total: { type: Number, required: true },

        status: { type: String, enum: ["pending", "paid", "cancelled"], default: "pending" },

        //Admin.jsx
    },

    {
        timestamps: true,
        toJSON: {
            //this is how mongoose represented when converted to JSON
            versionKey: false,
            transform: (_doc, ret) => {
                //doc is the original mongoose document
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
    },
);

module.exports = mongoose.model("Order", orderSchema);
