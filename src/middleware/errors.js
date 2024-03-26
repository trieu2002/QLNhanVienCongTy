export const errorHandler = (err, req, res, next) => {
    console.log('<<<<<<< err >>>>>>>', err.message);
    let errCode = err?.errCode || 500;
    let message = err?.message ?? "Server internal error";
    let errors = {};
    switch (err?.errCode) {
        case 401:
            errCode = err?.errCode,
                errors = err?.errors
            break;
        case 403:
            errCode = err?.errCode,
                errors = err?.errors
            break;

        case 404:
            errCode = err?.errCode,
            errors = err?.errors
            break;
        case 409:
            errCode = err?.errCode,
                errors = err?.errors
            break;
        case 500:
            errCode = err?.errCode,
                errors = err?.errors
            break;
        default:
            errCode = err?.errCode,
                errors = err?.errors
            break;
    }
    return res.status(errCode).json({
        statusCode: errCode,
        message: message,
        errors: errors
    })
}