import createHttpError from "http-errors";

const validateBody = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            throw createHttpError(400, error.message);
        }
        next();
    }
}

export default validateBody;