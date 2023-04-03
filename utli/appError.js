//This is class in which we can create of own or custom errors
class AppError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.isOperational=true;
        Error.captureStackTrace(this,this.constructor);
    }
};

module.exports = AppError;