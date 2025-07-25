import { Schema, model, Types } from "mongoose";

const sessionSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: "User",
        required:true,
    },
    accessToken: {
        type: String,
        required:true,
    },
    refreshToken: {
        type: String,
        required: true,
    },
    accessTokenValidUntil: {
        type: Date,
        required: true,
    },
    refreshTokenValidUntil: {
        type: Date,
        required: true, 
    },
})
const Session = model("Session", sessionSchema);

export default Session;