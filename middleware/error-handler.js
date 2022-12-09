import {StatusCodes} from "http-status-codes";

const errorHandlerMiddleware = (err, req, res, next) => {
    const customHandler = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || "Ooops something went wrong!"
    }
    
    if (err.name === "ValidationError") {
        customHandler.msg = Object.values(err.errors).map(item => item.message).join(",");
        customHandler.statusCode = StatusCodes.BAD_REQUEST;
    }

    if (err.code && err.code === "11000") {
        customHandler.msg = `${Object.keys(err.keyValue)}, field has to be unique`;
        customHandler.statusCode = StatusCodes.BAD_REQUEST;
    }

    res.status(customHandler.statusCode).json({msg: customHandler.msg});
}

export default errorHandlerMiddleware;