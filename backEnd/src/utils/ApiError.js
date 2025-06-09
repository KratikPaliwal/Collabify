// This ApiError class is a custom error handler in Node.js, specifically designed for clean and 
// consistent API error responses in Express or other backends.

class ApiError extends Error {
    constructor(statusCode, message = "Something went wrong", error = [], stack = "") {
        // super() is used to call the constructor of the parent class.
        super(message) // message ko over ride krta hai
        this.statusCode = statusCode,
        this.data = null // neccessary to send null
        this.message = message,
        this.success = false, //message jyega but it is success flag jaise jyega
        this.errors = error // error btata hai

        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

module.exports = {
    ApiError
}