// When writing async functions in Express (e.g. using await inside routes), 
// if an error is thrown and not caught, Express will not automatically catch it, 
// and the server may crash or behave unpredictably.

// it is like a wrapper
// it is promise based asyncHandler
// another method is to create using try and catch block
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise
        .resolve(requestHandler(req, res, next))
        .catch((error) => next(error))
    }
}

module.exports = {
    asyncHandler
}