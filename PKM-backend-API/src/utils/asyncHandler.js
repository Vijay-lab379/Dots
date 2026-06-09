//A General Function which can be used in anywhere
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise
        .resolve(requestHandler(req,res,next))
        .catch((err) => next(err))
    }
}

export { asyncHandler }