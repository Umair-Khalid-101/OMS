const multer = require('multer')
const path = require('path')
const { v4: uuidv4 } = require("uuid");

const MIME_TYPE_MAP = {
    'image/png': "png",
    'image/jpeg': "jpeg",
    'image/jpg': 'jpg',
    'image/svg+xml': 'svg+xml',
    'image/gif': 'gif',
    'image/*': 'image',
    'file/json': 'json',
    "application/pdf": "pdf",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "application/vnd.ms-excel": "xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "application/vnd.ms-powerpoint": "ppt",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
    "application/zip": "zip",
    "application/x-rar-compressed": "rar",
    "application/x-7z-compressed": "7z",
    "text/plain": "txt",
    "text/csv": "csv",
    "text/html": "html",
    "text/css": "css",
    "text/javascript": "js",
    "application/x-shockwave-flash": "swf",
    "video/x-flv": "flv",
    "video/mp4": "mp4",
    "video/quicktime": "mov",
    "video/x-msvideo": "avi",
    "video/x-ms-wmv": "wmv",
    "audio/mpeg": "mp3",
    "audio/x-wav": "wav",
    "audio/x-ms-wma": "wma",
    "application/vnd.android.package-archive": "apk",
    "application/x-pkcs12": "p12",
    "application/x-pkcs7-certificates": "p7b",
    "application/x-pkcs7-certreqresp": "p7r",
    "application/x-x509-ca-cert": "cer",
    "application/x-pem-file": "pem",
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + file.originalname)
    }
})

const filefilter = (req, file, cb) => {
    console.log(file.mimetype)
    const isValid = true
    let error = isValid ? null : new Error('Invalid File Type!')
    cb(error, isValid)
}

const upload = multer({ storage: storage, fileFilter: filefilter })

module.exports = { upload }