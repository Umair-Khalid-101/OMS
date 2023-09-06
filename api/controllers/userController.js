const userSchema = require('../models/userSchema')
const HttpError = require('../middleware/httpError')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const transporter = require('../middleware/nodemailer')
const notificationSchema = require('../models/notificationSchema')
const taskSchema = require('../models/taskSchema')

const getAllUsers = async (req, res, next) => {
    let users

    const { role } = req.query

    let where = {}

    if (role) where.role = {
        $in: role.split(',')
    }

    try {
        users = await userSchema.find(where, { name: 1, email: 1, role: 1, avatar: 1, name: 1, editorRequest: 1, status: 1 })
    }
    catch (err) {
        const error = new HttpError(err.message, 500)
        return next(error)
    }

    res.status(201).json({ users: users })
}

const getManagerCond = async (req, res, next) => {

    try {
        let users = await userSchema.find({
            $or: [
                { role: { $in: ['manager', 'printing', 'shipping'] } },
                // { editorRequest: 'active' },
                // { editorRequest: 'pending' },
                {
                    requestedRole:
                        { $in: ['manager', 'printing', 'shipping'] }
                }
            ]
        }, { name: 1, email: 1, role: 1, avatar: 1, name: 1, editorRequest: 1, status: 1, wallet: 1 })

        users = users.map(user => user.toObject({ getters: true }))

        for (let i = 0; i < users.length; i++) {
            console.log(users[i]._id)
            const tasks = await taskSchema.find({ assignTo: users[i]._id, status: ['active', 'pending', 'submitted'] })
            users[i].aTasks = tasks.length
            const tasks2 = await taskSchema.find({ assignTo: users[i]._id, status: 'completed' })
            users[i].cTasks = tasks2.length
        }

        res.status(200).json({ users: users })

    } catch (err) {
        return new HttpError(err.message, 500)
    }

}

const getDesignerByAM = async (req, res, next) => {

    try {
        const { host } = req.query

        const users = await userSchema.find({
            head: host,
            $or: [
                { role: { $in: ['designer'] } },
                { editorRequest: 'active' },
                { editorRequest: 'pending' },
                { requestedRole: { $in: ['designer'] } }
            ]
        }, { name: 1, email: 1, role: 1, avatar: 1, name: 1, editorRequest: 1, status: 1 })

        res.status(200).json({ users: users })

    } catch (err) {
        return new HttpError(err.message, 500)
    }

}

const getManager = async (req, res, next) => {
    try {

        const users = await userSchema.find({
            role: {
                $in: ['manager']
            }
        }, { name: 1, email: 1, role: 1, avatar: 1, name: 1, editorRequest: 1, status: 1 })
        res.status(200).json({ users: users })

    } catch (err) {
        return new HttpError(err.message, 500)
    }
}

const getDesigner = async (req, res, next) => {

    try {

        const { host } = req.query

        let where = {
            role: {
                $in: ['designer']
            }
        }

        if (host) where.head = host

        const users = await userSchema.find(where, { name: 1, email: 1, role: 1, avatar: 1, name: 1, editorRequest: 1, status: 1 })

        res.status(200).json({ users: users })

    } catch (err) {
        return new HttpError(err.message, 500)
    }

}

const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params

        const user = await userSchema.findById(id, { name: 1, email: 1, role: 1, avatar: 1, firstname: 1, lastname: 1 })

        if (!user) return next(new HttpError("User not found", 404))

        res.status(200).json({ user: user })

    } catch (err) {
        return new HttpError(err.message, 500)
    }

}

const updateStatus = async (req, res, next) => {
    try {
        const { id, status } = req.body

        const user = await userSchema.findById(id)

        if (!user) return next(new HttpError("User not found", 404))

        await userSchema.findByIdAndUpdate(id, { status: status })

        res.status(200).json({ message: "Status updated" })

    } catch (err) {
        return new HttpError(err.message, 500)
    }

}

const inviteUser = async (req, res, next) => {

    try {
        const { email, role } = req.body
        const exisitingUser = await userSchema.findOne({ email: email })

        if (exisitingUser) {

            if (exisitingUser.role.includes('manager') || exisitingUser.role.includes('admin') || exisitingUser.role.includes('designer')) return next(new HttpError("User already invited", 400))

            // if (exisitingUser.requestedRole.includes 'designer') return next(new HttpError("User has been invited for a role of designer", 400))

            const token = jwt.sign({ email: email, role: role, id: exisitingUser._id }, process.env.JWT_KEY, { expiresIn: '6h' })

            await userSchema.findByIdAndUpdate(exisitingUser._id, {
                editorRequest: 'pending',
                requestedRole: role
            })

            const mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: 'Invitation to join the team',
                html: `<p>You have been invited to join the team. Please click the link below to accept the invitation</p>
                <a href="${process.env.ADMIN_URL}/accept-invitation/${token}">Accept Invitation</a>`
            }

            transporter.sendMail(mailOptions, (err, info) => {
                if (err) return next(new HttpError(err.message, 500))
                else {
                    res.status(200).json({ message: "Invitation sent" })
                }
            }
            )
        } else {

            // create random password for user
            const password = Math.random().toString(36).slice(-8)

            const hashedPassword = await bcrypt.hash(password, 12)


            const newUser = new userSchema({
                email: email,
                password: hashedPassword,
                editorRequest: 'pending',
                requestedRole: role
            })

            await newUser.save()

            const token = jwt.sign({ id: newUser._id, email: email, role: role }, process.env.JWT_KEY, { expiresIn: '6h' })

            const mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: 'Invitation to join the team',
                html: `<p>You have been invited to join the team. Please click the link below to accept the invitation</p>
                <p>Your one time password is ${password}</p>
                <a href="${process.env.ADMIN_URL}/accept-invitation/${token}">Accept Invitation</a>`
            }

            transporter.sendMail(mailOptions, (err, info) => {
                if (err) return next(new HttpError(err.message, 500))
                else {
                    res.status(200).json({ message: "Invitation sent" })
                }

            })

        }
    } catch (error) {
        return next(new HttpError(error.message, 500))
    }

}

const inviteDesigner = async (req, res, next) => {

    try {
        const { email, head } = req.body
        const exisitingUser = await userSchema.findOne({ email: email })

        if (exisitingUser) {

            if (exisitingUser.role.includes('manager') || exisitingUser.role.includes('admin') || exisitingUser.role.includes('designer')) return next(new HttpError("User already invited", 400))

            // if (exisitingUser.requestedRole === 'manager') return next(new HttpError("User has been invited for a role of manager", 400))
            if (exisitingUser.head !== head) return next(new HttpError("User invited by another manager", 400))

            const token = jwt.sign({ email: email, role: ['designer'], id: exisitingUser._id, head: head }, process.env.JWT_KEY, { expiresIn: '6h' })

            const mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: 'Invitation to join the team',
                html: `<p>You have been invited to join the team as a designer. Please click the link below to accept the invitation</p>
                <a href="${process.env.ADMIN_URL}/accept-invitation/${token}">Accept Invitation</a>`
            }

            transporter.sendMail(mailOptions, (err, info) => {
                if (err) return next(new HttpError(err.message, 500))
                else {
                    res.status(200).json({ message: "Invitation sent" })
                }
            })

        } else {
            // create random password for user
            const password = Math.random().toString(36).slice(-8)

            const hashedPassword = await bcrypt.hash(password, 12)

            const newUser = new userSchema({
                email: email,
                password: hashedPassword,
                editorRequest: 'pending',
                requestedRole: ['designer'],
                head: head
            })

            await newUser.save()

            const token = jwt.sign({ id: newUser._id, email: email, role: ['designer'], head: head }, process.env.JWT_KEY, { expiresIn: '6h' })

            const mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: 'Invitation to join the team',
                html: `<p>You have been invited to join the team as a designer. Please click the link below to accept the invitation</p>
                <p>Your one time password is ${password}</p>
                <a href="${process.env.ADMIN_URL}/accept-invitation/${token}">Accept Invitation</a>`
            }

            transporter.sendMail(mailOptions, (err, info) => {
                if (err) return next(new HttpError(err.message, 500))
                else {
                    res.status(200).json({ message: "Invitation sent" })
                }

            })

        }

    } catch (error) {
        return next(new HttpError(error.message, 500))
    }

}

const acceptInvitation = async (req, res, next) => {
    try {
        const { token, name } = req.body

        const decodedToken = jwt.verify(token, process.env.JWT_KEY)

        const { id, email, role } = decodedToken

        let body = {
            role: role,
            editorRequest: 'active',
            requestedRole: [],
            name: name
        }

        if (decodedToken.head) body.head = decodedToken.head

        const existingUser = await userSchema.findById(id)

        if (!existingUser) return next(new HttpError("User not found", 404))

        if (existingUser.editorRequest === 'active') return next(new HttpError("User already accepted invitation. Please Login", 400))
        if (existingUser.editorRequest === 'blocked') return next(new HttpError("Invitation removed by admin", 400))

        await userSchema.findByIdAndUpdate(id, body)

        const newNotification = new notificationSchema({
            user: id,
            message: "You have been added to the team",
            link: "/",
            read: false
        })
        await newNotification.save()

        if (decodedToken.head) {
            const newNotification2 = new notificationSchema({
                user: decodedToken.head,
                message: `${email} has been added to your team`,
                link: "/",
                read: false
            })

            await newNotification2.save()
        } else {
            const admin = await userSchema.findOne({
                role: {
                    $in: ['admin']
                }
            })

            const newNotification2 = new notificationSchema({
                user: admin._id,
                message: `${email} has been added to your team`,
                link: "/",
                read: false
            })

            await newNotification2.save()
        }


        res.status(200).json({ message: "Invitation accepted" })

    } catch (error) {
        return next(new HttpError(error.message, 500))
    }

}

const removeInvitation = async (req, res, next) => {

    try {
        const { id } = req.params

        const existingUser = await userSchema.findById(id)

        if (!existingUser) return next(new HttpError("User not found", 404))

        if (existingUser.editorRequest === 'active') return next(new HttpError("User already accepted invitation", 400))

        await userSchema.findByIdAndUpdate(id, { editorRequest: 'blocked', requestedRole: [] })

        res.status(200).json({ message: "Invitation removed" })

    } catch (error) {
        return next(new HttpError(error.message, 500))
    }

}

module.exports = {
    getAllUsers,
    getUserById,
    inviteUser,
    inviteDesigner,
    acceptInvitation,
    removeInvitation,
    updateStatus,
    getManager,
    getDesigner,
    getDesignerByAM,
    getManagerCond
}