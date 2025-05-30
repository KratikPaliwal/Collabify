// jab bhi kisi ko bhi response sed kre gai toh isse ek claass ke use kre gai taiki response ka structure define kr rhe hai
class ApiResponse {
    constructor( statusCode, data, message = "Success") {
        this.statusCode = statusCode,
        this.data = data,
        this.message = message,
        this.success = statusCode < 400
    }
}

module.exports = {
    ApiResponse
}