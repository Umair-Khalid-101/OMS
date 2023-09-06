const HttpError = require('../middleware/httpError');

const uploadImage = async (req, res, next) => {
    const file = req?.file;

    if (!file) {
        const error = new HttpError('No image provided', 400);
        return next(error);
    }

    res.status(201).json({
        message: 'Image uploaded successfully',
        imageUrl: file.path
    });
}

const uploadImages = async (req, res, next) => {
    const files = req?.files;

    if (!files) {
        const error = new HttpError('No image provided', 400);
        return next(error);
    }

    res.status(201).json({
        message: 'Images uploaded successfully',
        imageUrls: files.map(file => file.path)
    });
}

const sendMail = async (req, res, next) => {
    const { emails, subject, text } = req.body;

    try {
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: emails,
            subject,
            text
        });

        res.status(200).json({
            message: 'Email sent successfully'
        });
    } catch (error) {
        return next(new HttpError(error.message, 500));
    }
}

module.exports = {
    uploadImage,
    uploadImages,
    sendMail
}
