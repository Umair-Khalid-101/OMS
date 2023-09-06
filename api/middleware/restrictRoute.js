const HttpError = require("./httpError");

exports.restrictTo = (...roles) => {
    return (req, res, next) => {

        const allowedRoles = roles
        const requestedRoles = req.user.role

        const isAllowed = requestedRoles.some(role => allowedRoles.includes(role))

        if (!isAllowed) {
            const error = new HttpError('You do not have access to this route', 401);
            return next(error)
        }

        next();
    };
};