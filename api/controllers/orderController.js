const orderSchema = require("../models/orderSchema")
const HttpError = require("../middleware/httpError");
const userSchema = require("../models/userSchema");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const nodemailer = require('nodemailer');
const transporter = require('../middleware/nodemailer')
const fetch = require("node-fetch")

const getOrders = async (req, res, next) => {

    let orders

    try {
        orders = await orderSchema.find({
            status: ["pending", "completed", "assigned"],
            $or: [
                { payment: "credit", paymentStatus: "succeeded" },
                { payment: "purchase" },
            ],
        }).sort({ date: 1 })
    } catch (err) {
        const error = new HttpError(err.message, 500)
        return next(error)
    }

    res.status(200).json({ orders: orders })
}

const getOrder = async (req, res, next) => {

    const orderId = req.params.id

    let order

    try {
        order = await orderSchema.findById(orderId)
    } catch (err) {
        const error = new HttpError(err.message, 500)
        return next(error)
    }

    res.status(200).json({ order: order })
}

const createOrder = async (req, res, next) => {

    const { products, customer, aboutUs, reOrder, shipping, sport, firstname, lastname, phone, school, email, shippingAddress, address2, city, state, zip, framed, face, jerseyBack, players, namePlate, font, colors, date, total, jersies, pos, logo, payment, poNum } = req.body

    let existingUser = await userSchema.findOne({ email: email })
    let user = existingUser;
    if (!existingUser) {
        const newUser = new userSchema({
            name: firstname + " " + lastname,
            email: email,
        })

        try {
            await newUser.save()
        } catch (err) {
            const error = new HttpError(err.message, 500)
            return next(error)
        }

        user = newUser

    }

    let paymentInfo = {}
    let sts = "pending"

    if (payment === "credit") {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: total * 100,
            currency: "usd",
            automatic_payment_methods: {
                enabled: true,
            },
        });

        paymentInfo = {
            paymentId: paymentIntent.id,
            paymentStatus: paymentIntent.status,
            paymentAmount: paymentIntent.amount,
            paymentCurrency: paymentIntent.currency,
            clientSecret: paymentIntent.client_secret,
        }
    } else {
        if (pos.length > 0 || poNum) {
            sts = "submitted"
        }
    }

    const newOrder = new orderSchema({
        userId: user._id,
        products: products,
        customer: customer,
        aboutUs: aboutUs,
        reOrder: reOrder,
        shipping: shipping,
        sport: sport,
        firstname: firstname,
        lastname: lastname,
        phone: phone,
        school: school,
        email: email,
        shippingAddress: shippingAddress,
        address2: address2,
        city: city,
        state: state,
        zip: zip,
        framed: framed,
        face: face,
        jerseyBack: jerseyBack,
        players: players,
        namePlate: namePlate,
        font: font,
        colors: colors,
        date: date,
        payment: payment,
        total: total,
        jersies: jersies,
        pos: pos,
        logo: logo,
        paymentStatus: sts,
        payment: payment,
        paymentInfo: paymentInfo,
        poNum: poNum
    })

    try {
        await newOrder.save()
    } catch (err) {
        const error = new HttpError(err.message, 500)
        return next(error)
    }

    if (payment === "credit") {
        res.status(201).json({ message: 'Order created successfully', paymentInfo: paymentInfo })
        return
    }


    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Purchase Order Confirmation',
        html: `
        <div
            class="container"
            style="max-width: 90%; margin: auto; padding-top: 20px"
        >
            <h1 style="text-align: center; margin-bottom: 30px;">
                Purchase Order Confirmation
            </h1>

            <p style="margin-bottom: 30px;">
                Hi ${firstname} ${lastname},
            </p>

            <p style="margin-bottom: 30px;">
                Thank you for your purchase order. Please click the button below to update your purchase order.
            </p>

            <a
                href="${process.env.ADMIN_URL}/update-po/${newOrder._id}"
                style="text-decoration: none; color: white; background-color: #007bff; padding: 10px 20px; border-radius: 5px"
            >
                Update PO
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
            res.status(201).json({ message: 'Order created successfully', paymentInfo: paymentInfo })
        }
    });


}

const sendReminder = async (req, res, next) => {

    const orderId = req.params.id

    let order

    try {
        order = await orderSchema.findById(orderId)

        console.log(order)

        const email = order.email

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Purchase Order Reminder',
            html: `
            <div
                class="container"
                style="max-width: 90%; margin: auto; padding-top: 20px"
            >
                <h1 style="text-align: center; margin-bottom: 30px;">
                    Purchase Order Reminder
                </h1>

                <p style="margin-bottom: 30px;">
                    Hi ${order.firstname} ${order.lastname},
                </p>

                <p style="margin-bottom: 30px;">
                    This is a reminder that you have a pending purchase order with us. Please click the button below to update your purchase order.
                </p>

                <a
                    href="${process.env.ADMIN_URL}/update-po/${order._id}"
                    style="text-decoration: none; color: white; background-color: #007bff; padding: 10px 20px; border-radius: 5px"
                >
                    Update PO
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
                console.log("Email sent: " + info.response);
                res.status(200).json({ order })
            }
        });

    } catch (err) {
        const error = new HttpError(err.message, 500)
        return next(error)
    }

}

const updateOrder = async (req, res, next) => {

    const orderId = req.params.id

    const body = req.body

    let order

    try {

        order = await orderSchema.findById(orderId)

        if (!order) return next(new HttpError("Order not found", 404))

        await orderSchema.findByIdAndUpdate(orderId, body)

        res.status(200).json({ order })

    } catch (err) {
        const error = new HttpError(err.message, 500)
        return next(error)
    }

}

const deleteOrder = async (req, res, next) => {

    const orderId = req.params.id

    let order

    try {
        order = await orderSchema.findById(orderId)

        if (!order) return next(new HttpError("Order not found", 404))

        await orderSchema.findByIdAndDelete(orderId)

        res.status(200).json({ message: "Order deleted successfully" })

    } catch (err) {
        const error = new HttpError(err.message, 500)
        return next(error)
    }

}

// GET SHIPPING RATES
const getShippingRates = async (req, res, next) => {
    console.log("API HIT")
    const query = new URLSearchParams({
        client_id: '4jpoRAGW3X6tGvnTBemjMcJLjd3a04JlflavQ3JbSjzkcKOC',
        redirect_uri: 'http://localhost:8001/'
    }).toString();
    
    const resp = await fetch(
        `https://wwwcie.ups.com/security/v1/oauth/validate-client?${query}`,
        {method: 'GET'}
    );

    const data = await resp.text();
    console.log(data);
    
    return res.json("API HIT")
}

module.exports = {
    getOrders,
    getOrder,
    createOrder,
    sendReminder,
    updateOrder,
    deleteOrder,
    getShippingRates
}