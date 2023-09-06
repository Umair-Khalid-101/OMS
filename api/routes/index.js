const {
    uploadImage,
    uploadImages,
    sendMail
} = require('../controllers/');

const express = require('express');
const { upload } = require('../middleware/multer');
const router = express.Router();

router.post('/upload-image', upload.single('image'), uploadImage);
router.post('/upload-images', upload.array('images'), uploadImages);
router.post('/send-mail', sendMail);

module.exports = router;
