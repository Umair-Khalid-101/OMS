const userSchema = require('../models/userSchema')
const HttpError = require('../middleware/httpError')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const transporter = require('../middleware/nodemailer')
const notificationSchema = require('../models/notificationSchema')

const signup = async (req, res, next) => {

    const { name, email, password } = req.body

    let existingUser

    try {
        existingUser = await userSchema.findOne({ email: email })

    } catch (err) {
        const error = new HttpError(err.message, 500)
        return next(error)
    }

    if (existingUser) {
        const error = new HttpError('User already exists', 422)
        return next(error)
    }

    let hashedPassword

    try {
        hashedPassword = await bcrypt.hash(password, 12)
    } catch (err) {
        const error = new HttpError(err.message, 500)
        return next(error)
    }

    const newUser = new userSchema({
        name: name,
        email: email,
        password: hashedPassword
    })

    try {
        await newUser.save()
    } catch (err) {
        const error = new HttpError(err.message, 500)
        return next(error)
    }

    res.status(201).json({ message: 'User created successfully' })

}

const login = async (req, res, next) => {

    const { email, password } = req.body

    let existingUser

    try {
        existingUser = await userSchema.findOne({ email: email })

    } catch (err) {

        const error = new HttpError(err.message, 500)
        return next(error)
    }

    if (!existingUser) {
        const error = new HttpError('Invalid credentials', 401)
        return next(error)
    }

    let isValidPassword = false

    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password)
    } catch (err) {

        const error = new HttpError(err.message, 500)
        return next(error)
    }

    if (!isValidPassword) {
        const error = new HttpError('Invalid credentials', 401)
        return next(error)
    }

    let token;
    try {
        token = jwt.sign({ id: existingUser.id, email: existingUser.email, role: existingUser.role }, process.env.JWT_KEY, { expiresIn: '6h' })

    } catch (err) {
        const error = new HttpError(err.message, 500);
        return next(error);
    }

    res.status(201).json({ message: "Login Success", user: { id: existingUser.id, email: existingUser.email, role: existingUser.role, status: existingUser.status }, token: token });

}

const forgotPassword = async (req, res, next) => {

    try {
        const { email } = req.body

        console.log(email)

        const existingUser = await userSchema.findOne({ email: email })

        if (!existingUser) return next(new HttpError("User not found", 404))

        const token = jwt.sign({ id: existingUser.id, email: existingUser.email }, process.env.JWT_KEY, { expiresIn: '6h' })

        res.status(200).json({ message: "Token created", token: token })

    } catch (error) {
        return next(new HttpError(error.message, 500))
    }

}

const resetPassword = async (req, res, next) => {

    try {
        const { password, token } = req.body

        const decodedToken = jwt.verify(token, process.env.JWT_KEY)

        const existingUser = await userSchema.findById(decodedToken.id)

        if (!existingUser) return next(new HttpError("User not found", 404))

        const hashedPassword = await bcrypt.hash(password, 12)

        await userSchema.findByIdAndUpdate(decodedToken.id, { password: hashedPassword })

        res.status(200).json({ message: "Password updated" })

    } catch (error) {
        return next(new HttpError(error.message, 500))
    }

}

const getbasicProfile = async (req, res, next) => {

    try {
        const { id } = req.user

        const user = await userSchema.findById(id)

        if (!user) return next(new HttpError("User not found", 404))

        res.status(200).json({ user })

    } catch (error) {
        return next(new HttpError(error.message, 500))
    }

}

const updatePassword = async (req, res, next) => {

    try {
        const { id } = req.user

        const { oldpassword, newpassword } = req.body

        const user = await userSchema.findById(id)

        if (!user) return next(new HttpError("User not found", 404))

        let isValidPassword = false

        isValidPassword = await bcrypt.compare(oldpassword, user.password)

        if (!isValidPassword) {
            const error = new HttpError('Invalid credentials', 401)
            return next(error)
        }

        const hashedPassword = await bcrypt.hash(newpassword, 12)

        await userSchema.findByIdAndUpdate(id, { password: hashedPassword })

        res.status(200).json({ message: "Password updated" })

    } catch (error) {
        return next(new HttpError(error.message, 500))
    }

}

module.exports = {
    signup,
    login,
    forgotPassword,
    resetPassword,
    getbasicProfile,
    updatePassword
}