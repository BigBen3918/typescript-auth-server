/** @format */

import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Basic Schema
const BasicSchema = new Schema({
    name: {
        type: String,
        default: "",
    },
    email: {
        type: String,
        default: "",
        require: true,
    },
    password: {
        type: String,
        default: "",
    },
});

export default mongoose.model("users", BasicSchema);
