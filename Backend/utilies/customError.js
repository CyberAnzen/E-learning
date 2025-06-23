class customError extends Error{
    constructor(message, statusCode=400,data={},err=null) {
        super(message);
        this.statusCode = statusCode;
        this.success = false; // Indicate that this is an error
        this.data=data
        this.error = err; // Store the original error if provided
        this.name = this.constructor.name; // Set the error name to the class name
        Error.captureStackTrace(this, this.constructor); // Capture the stack trace
}
}

module.exports = customError;