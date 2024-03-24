export const catchAsyncError = fn => (req, res, next) => {
    return Promise
        .resolve(fn(req, res, next))
        .catch(next)
}