const notificationSchema = require('../models/notificationSchema');
const HttpError = require('../middleware/httpError');

const getNotification = async (req, res, next) => {

    const { uid } = req.params

    let notification

    try {
        notification = await notificationSchema.find({ users: uid })
    }
    catch (err) {
        const error = new HttpError(err.message, 500);
        return next(error);
    }

    res.status(200).json({ message: "Notification Fetched", notification })

}

module.exports = {
    getNotification
}