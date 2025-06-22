import mongoose from "mongoose";
import createHttpError from "http-errors";


const isValidId = (req, res, next) => {
    const { contactId } = req.params;
    const isValid = mongoose.Types.ObjectId.isValid(contactId);
    if (!isValid) {
        throw createHttpError(400, "Invalid ID format");
    }
    next();
}

export default isValidId;
