const jwt = require('jsonwebtoken');
const HttpError = require("./httpError");

module.exports = (req, res, next) => {
    try {

        if (!req.headers.authorization) {
            throw new Error("No Token Found", 401)
        }

        let token = req.headers.authorization?.replace('Bearer', '').trim();
        token = token.replace('"', '').trim();
        token = token.replace('"', '').trim();

        if (!token) {
            throw new Error('Athentication Failed');
        }

        const decodedToken = jwt.verify(token, process.env.JWT_KEY)
        req.user = { id: decodedToken.id, email: decodedToken.email, role: decodedToken.role }
        next();
    } catch (err) {
        console.log(err)
        const error = new HttpError(err.message || 'Athentication Failed', 401);
        return next(error)
    }

}