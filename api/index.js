const dotenv = require('dotenv')
dotenv.config()

const session = require('express-session');

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const http = require('http');


const HttpError = require('./middleware/httpError')
const path = require('path')



const app = express()
const server = http.createServer(app);

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));


const port = process.env.PORT || 5000
const url = ""


const corsOptions = {
    origin: [process.env.CLIENT_URL, process.env.ADMIN_URL, "http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    optionSuccessStatus: 200
}

app.use(cors(corsOptions))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('/assets', express.static(path.join(__dirname, 'dist/assets')))

app.use('/api/auth', require('./routes/authRouter'))
app.use('/api/user', require('./routes/userRouter'))
app.use('/api/task', require('./routes/taskRouter'))
app.use('/api/notification', require('./routes/notificationRouter'))
app.use('/api/order', require('./routes/orderRouter'))
app.use('/api', require('./routes/'))

app.use(express.static(path.join(__dirname, "dist")))
app.get('/*', function (req, res) {
    res.sendFile(
        path.resolve(__dirname, "dist/index.html"),
        function (err) {
            if (err) {
                res.status(500).send(err);
            }
        }
    )
})

app.use((req, res, next) => {
    const error = new HttpError("Could not find this route.", 404);
    return next(error);
});

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose
    .connect(process.env.MONGODB_URI || url)
    .then(() => {
        server.listen(port, () => {
            console.log("App started on " + port)
        })
        console.log("Connected to Database")
    }).catch((err) => {
        console.log("Error Occured", err)
    })