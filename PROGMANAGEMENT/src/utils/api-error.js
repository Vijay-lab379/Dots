class ApiError extends Error {
    constructor(
        statusCode,
        message = "Somthing went wrong",
        errors = [],
        stack = ""
    ){
        super(message) // calling a constructor of parent class ("Error" here)
        this.statusCode = statusCode,
        this.message = message,
        this.data = null,
        this.succes = false,
        this.errors = errors;
        if(stack){
            this.stack = stack
        }
        else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {ApiError }