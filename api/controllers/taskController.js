const taskSchema = require("../models/taskSchema")
const HttpError = require('../middleware/httpError')
const mongoose = require("mongoose")
const transporter = require('../middleware/nodemailer')
const orderSchema = require("../models/orderSchema")
const userSchema = require("../models/userSchema")
const jwt = require('jsonwebtoken')

const getTasksByLid = async (req, res, next) => {

    const { manager, designer, delivery, printer } = req.query

    try {
        let tasks;

        let where = {}

        if (manager) where.assignTo = manager
        if (designer) where.designer = designer
        if (delivery) where.delivery = delivery
        if (printer) where.printer = printer

        tasks = await taskSchema.find(where).populate("assignTo", { name: 1, email: 1 }).populate("designer", { name: 1, email: 1 }).populate("order")

        res.status(200).json({
            tasks
        })

    } catch (error) {
        return next(new HttpError(error.message, 500))
    }

}

const getTaskById = async (req, res, next) => {

    const { tid } = req.params

    try {
        let task;

        task = await taskSchema.findById(tid).populate("assignTo", { name: 1, email: 1 }).populate("designer", { name: 1, email: 1 }).populate("order")

        res.status(200).json({ task })

    } catch (error) {
        return next(new HttpError(error.message, 500))
    }

}

const createTask = async (req, res, next) => {

    const { assignTo, order } = req.body

    try {
        const newTask = new taskSchema({
            assignTo,
            order
        })

        await newTask.save()

        if (order) {

            const odr = await orderSchema.findById(order)

            if (!odr) return next(new HttpError("Order not found", 404))

            await userSchema.findByIdAndUpdate(assignTo, {
                wallet: mongoose.Types.Decimal128.fromString((parseFloat(odr.total) * 0.1).toString())
            })

            await orderSchema.findByIdAndUpdate(order, { status: "assigned", assignTo, task: newTask._id })

            console.log(odr)

            const mailOptions01 = {
                from: process.env.EMAIL,
                to: odr?.email,
                subject: 'Order Assigned',
                html: `
            <div
                class="container"
                style="max-width: 90%; margin: auto; padding-top: 20px"
            >
                <h1 style="text-align: center; margin-bottom: 30px;">
                    Order Assigned
                </h1>

                <p style="margin-bottom: 30px;">
                    Your order has been assigned to a manager. Please click the button below to view the order.
                </p>

                <a
                    href="${process.env.ADMIN_URL}/task/${newTask._id}"
                    style="text-decoration: none; color: white; background-color: #007bff; padding: 10px 20px; border-radius: 5px"
                >
                    View Order
                </a>

                <p style="margin-top: 30px;">
                    Thank you for choosing us.
                </p>
            </div>
            `
            };

            transporter.sendMail(mailOptions01, function (error, info) {
                if (error) {
                    console.log(error);
                    return next(new HttpError(error.message, 500))
                } else {
                    console.log("Email sent: " + info.response);
                }
            }
            );

        }

        const task = await taskSchema.findById(newTask._id).populate("assignTo", { name: 1, email: 1 })

        const mailOptions = {
            from: process.env.EMAIL,
            to: task?.assignTo?.email,
            subject: 'New Task',
            html: `
            <div
                class="container"
                style="max-width: 90%; margin: auto; padding-top: 20px"
            >
                <h1 style="text-align: center; margin-bottom: 30px;">
                    New Task
                </h1>

                <p style="margin-bottom: 30px;">
                    You have been assigned a new task. Please click the button below to view the task.
                </p>

                <a
                    href="${process.env.ADMIN_URL}"
                    style="text-decoration: none; color: white; background-color: #007bff; padding: 10px 20px; border-radius: 5px"
                >
                    View Task
                </a>

                <p style="margin-top: 30px;">
                    Assign the task to a designer.
                </p>

            </div>
            `
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                return next(new HttpError(error.message, 500))
            } else {
                console.log("Email sent: " + info.response);
                res.status(200).json({ task: newTask })
            }

        });




    }

    catch (error) {
        return next(new HttpError(error.message, 500))
    }

}

const updateTask = async (req, res, next) => {

    const { tid } = req.params

    try {

        const task = await taskSchema.findById(tid)

        if (!task) return next(new HttpError("Task not found", 404))

        await taskSchema.findByIdAndUpdate(tid, req.body)

        res.status(200).json({ task })

    } catch (error) {
        return next(new HttpError(error.message, 500))
    }

}

const assignDesigner = async (req, res, next) => {
    const { tid } = req.params
    const { designer } = req.body

    try {

        const task = await taskSchema.findById(tid)

        if (!task) return next(new HttpError("Task not found", 404))

        await taskSchema.findByIdAndUpdate(tid, {
            designer,
            status: "in-progress"
        })

        const mailOptions = {
            from: process.env.EMAIL,
            to: designer,
            subject: 'New Task',
            html: `
            <div
                class="container"
                style="max-width: 90%; margin: auto; padding-top: 20px"
            >
                <h1 style="text-align: center; margin-bottom: 30px;">
                    New Task
                </h1>

                <p style="margin-bottom: 30px;">
                    You have been assigned a new task. Please click the button below to view the task.  
                </p>

                <a
                    href="${process.env.ADMIN_URL}"
                    style="text-decoration: none; color: white; background-color: #007bff; padding: 10px 20px; border-radius: 5px"
                >
                    View Task
                </a>

                <p style="margin-top: 30px;">
                    Thank you for choosing us.
                </p>
            </div>
            `

        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                return next(new HttpError(error.message, 500))
            } else {
                res.status(200).json({ task })
            }
        });


    } catch (error) {
        return next(new HttpError(error.message, 500))
    }
}

const assignPrinter = async (req, res, next) => {
    const { tid } = req.params
    const { printer } = req.body

    try {

        const task = await taskSchema.findById(tid)

        if (!task) return next(new HttpError("Task not found", 404))

        await taskSchema.findByIdAndUpdate(tid, {
            printer,
            status: "ready-to-print"
        })

        const user = await userSchema.findById(printer)


        const mailOptions = {
            from: process.env.EMAIL,
            to: user?.email,
            subject: 'New Task',
            html: `
            <div
                class="container"
                style="max-width: 90%; margin: auto; padding-top: 20px"
            >
                <h1 style="text-align: center; margin-bottom: 30px;">
                    New Task
                </h1>

                <p style="margin-bottom: 30px;">
                    You have been assigned a new task. Please click the button below to view the task.  
                </p>

                <a
                    href="${process.env.ADMIN_URL}"
                    style="text-decoration: none; color: white; background-color: #007bff; padding: 10px 20px; border-radius: 5px"
                >
                    View Task
                </a>

                <p style="margin-top: 30px;">
                    Thank you for choosing us.
                </p>
            </div>
            `

        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                return next(new HttpError(error.message, 500))
            } else {
                res.status(200).json({ task })
            }
        });


    } catch (error) {
        return next(new HttpError(error.message, 500))
    }

}

const taskPrinted = async (req, res, next) => {
    const { tid } = req.params
    try {

        const task = await taskSchema.findById(tid).populate("assignTo", { email: 1 })

        if (!task) return next(new HttpError("Task not found", 404))

        await taskSchema.findByIdAndUpdate(tid, {
            status: "printed"
        })

        const mailOptions = {
            from: process.env.EMAIL,
            to: task?.assignTo?.email,
            subject: 'New Task',
            html: `
            <div
                class="container"
                style="max-width: 90%; margin: auto; padding-top: 20px"
            >
                <h1 style="text-align: center; margin-bottom: 30px;">
                    Task Printed
                </h1>

                <p style="margin-bottom: 30px;">
                    Your task has been printed. Please click the button below to view the task.
                </p>

                <a
                    href="${process.env.ADMIN_URL}"
                    style="text-decoration: none; color: white; background-color: #007bff; padding: 10px 20px; border-radius: 5px"
                >
                    View Task
                </a>

                <p style="margin-top: 30px;">
                    Thank you for choosing us.
                </p>
            </div>
            `

        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                return next(new HttpError(error.message, 500))
            } else {
                res.status(200).json({ task })
            }
        });


    } catch (error) {
        return next(new HttpError(error.message, 500))
    }

}


const assignDelivery = async (req, res, next) => {
    const { tid } = req.params
    const { delivery } = req.body

    console.log(delivery)

    try {

        const task = await taskSchema.findById(tid)

        if (!task) return next(new HttpError("Task not found", 404))

        await taskSchema.findByIdAndUpdate(tid, {
            delivery,
            status: "ready-to-deliver"
        })

        const user = await userSchema.findById(delivery)

        console.log(user)

        const mailOptions = {
            from: process.env.EMAIL,
            to: user?.email,
            subject: 'New Task',
            html: `
            <div
                class="container"
                style="max-width: 90%; margin: auto; padding-top: 20px"
            >
                <h1 style="text-align: center; margin-bottom: 30px;">
                    New Task
                </h1>

                <p style="margin-bottom: 30px;">
                    You have been assigned a new task. Please click the button below to view the task.  
                </p>

                <a
                    href="${process.env.ADMIN_URL}"
                    style="text-decoration: none; color: white; background-color: #007bff; padding: 10px 20px; border-radius: 5px"
                >
                    View Task
                </a>

                <p style="margin-top: 30px;">
                    Thank you for choosing us.
                </p>
            </div>
            `

        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                return next(new HttpError(error.message, 500))
            } else {
                res.status(200).json({ task })
            }
        });


    } catch (error) {
        return next(new HttpError(error.message, 500))
    }

}

const taskDelievered = async (req, res, next) => {
    const { tid } = req.params
    try {

        const task = await taskSchema.findById(tid).populate("assignTo", { email: 1 })

        if (!task) return next(new HttpError("Task not found", 404))

        await taskSchema.findByIdAndUpdate(tid, {
            status: "delivered"
        })

        const mailOptions = {
            from: process.env.EMAIL,
            to: task?.assignTo?.email,
            subject: 'New Task',
            html: `
            <div
                class="container"
                style="max-width: 90%; margin: auto; padding-top: 20px"
            >
                <h1 style="text-align: center; margin-bottom: 30px;">
                    Task Delivered
                </h1>

                <p style="margin-bottom: 30px;">
                    Your task has been delievered. Please click the button below to view the task.
                </p>

                <a
                    href="${process.env.ADMIN_URL}"
                    style="text-decoration: none; color: white; background-color: #007bff; padding: 10px 20px; border-radius: 5px"
                >
                    View Task
                </a>

                <p style="margin-top: 30px;">
                    Thank you for choosing us.
                </p>
            </div>
            `

        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                return next(new HttpError(error.message, 500))
            } else {
                res.status(200).json({ task })
            }
        });


    } catch (error) {
        return next(new HttpError(error.message, 500))
    }

}

const deleteTask = async (req, res, next) => {

    const { tid } = req.params

    try {

        const task = await taskSchema.findById(tid)

        if (!task) return next(new HttpError("Task not found", 404))

        await taskSchema.findByIdAndDelete(tid)

        res.status(200).json({ task })

    } catch (error) {
        return next(new HttpError(error.message, 500))
    }

}

const submitToManager = async (req, res, next) => {

    const { tid } = req.params
    const { design } = req.body

    try {

        const task = await taskSchema.findById(tid).populate("assignTo", { name: 1, email: 1 })

        if (!task) return next(new HttpError("Task not found", 404))
        await taskSchema.findByIdAndUpdate(tid, { status: "submitted-to-manager", design, submittedBy: 'designer' })

        // send email to manager
        const manager = task.assignTo.email

        const token = jwt.sign({ tid }, process.env.JWT_KEY, { expiresIn: '7d' })

        const mailOptions = {
            from: process.env.EMAIL,
            to: manager,
            subject: 'Task Completed',
            html: `
                < div    
                class= "container"
                style="max-width: 90%; margin: auto; padding-top: 20px"
            >
                <h1 style="text-align: center; margin-bottom: 30px;">
                    Task Completed
                </h1>

                <p style="margin-bottom: 30px;">
                    Your task has been completed by the designer. Please click the
                </p>
                <a
                    href="${process.env.ADMIN_URL}"
                    style="text-decoration: none; color: white; background-color: #007bff; padding: 10px 20px; border-radius: 5px"
                >
                    View Task
                    </a>
                <p style="margin-top: 30px;">
                    Please verify the task and submit to client.
                </p>
            </ >
    `
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                return next(new HttpError(error.message, 500))
            } else {
                console.log("Email sent: " + info.response);
                res.status(200).json({ task })
            }
        });


    } catch (error) {
        return next(new HttpError(error.message, 500))
    }
}

const submitToAdmin = async (req, res, next) => {

    const { tid } = req.params
    const { design } = req.body

    try {

        const task = await taskSchema.findById(tid)

        if (!task) return next(new HttpError("Task not found", 404))

        await taskSchema.findByIdAndUpdate(tid, { status: "submitted-to-admin", design, submittedBy: 'manager' })

        // send email to admin
        const admin = await userSchema.findOne({ role: 'admin' })

        const token = jwt.sign({ tid }, process.env.JWT_KEY, { expiresIn: '7d' })

        const mailOptions = {
            from: process.env.EMAIL,
            to: admin?.email,
            subject: 'Task Completed',
            html: `
    < div
class="container"
style = "max-width: 90%; margin: auto; padding-top: 20px"
    >
                <h1 style="text-align: center; margin-bottom: 30px;">
                    Task Completed
                </h1>

                <p style="margin-bottom: 30px;">
                    Your task has been completed by our designer. Please click the
                </p>
                <a
                    href="${process.env.ADMIN_URL}"
                    style="text-decoration: none; color: white; background-color: #007bff; padding: 10px 20px; border-radius: 5px"
                >
                    View Task
                    </a>
                <p style="margin-top: 30px;">
                    Please verify the task and submit to client.
                </p>
            </ >
    `
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                return next(new HttpError(error.message, 500))
            } else {
                console.log("Email sent: " + info.response);
                res.status(200).json({ task })
            }
        });

    } catch (error) {
        return next(new HttpError(error.message, 500))
    }
}

const submitToClient = async (req, res, next) => {

    const { tid } = req.params
    const { managerReview, design } = req.body

    try {
        const task = await taskSchema.findById(tid).populate("order")

        if (!task) return next(new HttpError("Task not found", 404))

        console.log(task)

        await taskSchema.findByIdAndUpdate(tid, { status: "submitted", submittedBy: 'admin', managerReview, design })

        const token = jwt.sign({ tid }, process.env.JWT_KEY, { expiresIn: '7d' })

        const mailOptions = {
            from: process.env.EMAIL,
            to: task?.order?.email,
            subject: 'Task Completed',
            html: `
    <div
class="container"
style = "max-width: 90%; margin: auto; padding-top: 20px">
                <h1 style="text-align: center; margin-bottom: 30px;">
                    Task Completed
                </h1>

                <p style="margin-bottom: 30px;">
                    Your design has been completed by our designer and is pending approval.
                </p>

                <img
                    src="${process.env.SERVER_URL + '/' + task.design}"
                    style="width: 100%; height: 400px; object-fit: cover; margin-bottom: 30px"
                />
                <a
                    href="${process.env.ADMIN_URL}/task/${task._id}/${token}"
                    style="text-decoration: none; color: white; background-color: #007bff; padding: 10px 20px; border-radius: 5px"
                >
                    View Task
                    </a>
                <p style="margin-top: 30px;">
                    Thank you for choosing us.
                </p>
            </div >
    `
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                return next(new HttpError(error.message, 500))
            } else {
                console.log("Email sent: " + info.response);
                res.status(200).json({ task })
            }
        });

    } catch (error) {
        return next(new HttpError(error.message, 500))
    }
}

const rejectSubmission = async (req, res, next) => {

    const { tid, review } = req.body

    try {
        const task = await taskSchema.findById(tid)

        if (!task) return next(new HttpError("Task not found", 404))

        await taskSchema.findByIdAndUpdate(tid, { status: "in revision", review: review })

        res.status(200).json({ task })

    } catch (error) {
        return next(new HttpError(error.message, 500))
    }

}


module.exports = {
    getTasksByLid,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    submitToManager,
    submitToClient,
    rejectSubmission,
    submitToAdmin,
    assignDesigner,
    assignPrinter,
    assignDelivery,
    taskPrinted,
    taskDelievered
}