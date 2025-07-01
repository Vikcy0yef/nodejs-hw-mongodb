import { Schema, model } from "mongoose";
import validator from "validator";

const { isEmail } = validator;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        validate: [isEmail, "Invalid email"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
},
    { timestamps: true }
);
const User = model("User", userSchema);
export default User;