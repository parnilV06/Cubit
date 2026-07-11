const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let errorDetails = null;

    // Prisma Errors
    if (err.name === 'PrismaClientKnownRequestError') {
        if (err.code === 'P2002') {
            statusCode = 409;
            message = 'Duplicate field value entered';
        } else if (err.code === 'P2025') {
            statusCode = 404;
            message = 'Resource not found';
        } else {
            statusCode = 400;
            message = 'Database operation failed';
        }
    } else if (err.name === 'PrismaClientValidationError') {
        statusCode = 400;
        message = 'Invalid data provided';
    }

    // JWT Errors
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Unauthorized: Invalid token';
    } else if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Unauthorized: Token expired';
    }

    // Validation/Custom Errors
    if (message.includes('not found') || message.includes('Unauthorized') || message.includes('required') || message.includes('Invalid')) {
        if (message.includes('not found')) statusCode = 404;
        if (message.includes('Unauthorized') || message.includes('Cannot')) statusCode = 403;
        if (message.includes('required') || message.includes('Invalid')) statusCode = 400;
    }

    if (process.env.NODE_ENV === 'development') {
        errorDetails = err.stack;
        console.error(`[Error] ${message}\n`, err);
    } else {
        console.error(`[Error] ${message}`);
    }

    return res.status(statusCode).json({
        success: false,
        message,
        ...(errorDetails && { error: errorDetails })
    });
};

module.exports = errorHandler;
