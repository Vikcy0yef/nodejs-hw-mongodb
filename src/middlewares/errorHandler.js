const errorHandler = (err, req, res, next) => {
    res.status(err.status||err.statusCode||500).json({
        status: Array.status||err.statusCode|| 500,
        message: err.message|| "Something went wrong",
        data:err.message,
    })
}

export default errorHandler;