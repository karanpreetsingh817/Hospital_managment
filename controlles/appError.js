class AppError extends Error {   //This is class in which we can create of own or custom errors
    constructor(statusCode,message){
        super(message);
        this.statusCode = statusCode; 
        this.message = message;
    }
};


module.exports=AppError;