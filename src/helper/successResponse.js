const successResponse = (res, statusCode, message, data) => {
    return res.status(statusCode || 200).json({
        statusCode: statusCode || 200,
        message: message || "Success",
        data: data || []
    })
};
export default successResponse; 