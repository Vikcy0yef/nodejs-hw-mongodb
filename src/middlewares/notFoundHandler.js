import createHttpError from "http-errors";
const notFoundHandler = (req, res, next) => {
    const error = createHttpError(404, "Route not found");
    next(error);
}

export default notFoundHandler;