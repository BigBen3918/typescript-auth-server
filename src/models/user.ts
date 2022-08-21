/** @format */

import mongoose from "mongoose";
import { createFalse } from "typescript";
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
    verify: {
        type: Boolean,
        default: false
    }
});

export default mongoose.model("users", BasicSchema);
