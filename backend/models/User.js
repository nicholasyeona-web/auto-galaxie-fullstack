const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, trim: true, unique: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["user", "admin"], default: "user" },
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

module.exports = mongoose.model("User", userSchema);
