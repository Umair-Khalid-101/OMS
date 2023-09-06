const mongoose = require("mongoose")

const schema = mongoose.Schema

const orderSchema = schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    products: [{ type: String }],
    status: { type: String, default: "pending" },
    customer: { type: String },
    aboutUs: { type: String },
    reOrder: { type: String },
    shipping: { type: String },
    sport: { type: String },
    firstname: { type: String },
    lastname: { type: String },
    phone: { type: String },
    school: { type: String },
    email: { type: String },
    shippingAddress: { type: String },
    address2: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    framed: { type: String },
    face: { type: String },
    jerseyBack: { type: String },
    players: { type: String },
    namePlate: { type: String },
    font: { type: String },
    colors: { type: String },
    date: { type: String },
    payment: { type: String },
    total: { type: Number },
    jersies: [{
        file: { type: String },
        name: { type: String },
    }],
    pos: [{
        file: { type: String },
        name: { type: String },
    }],
    logo: [{
        file: { type: String },
        name: { type: String },
    }],
    paymentStatus: { type: String, default: "pending" },
    paymentInfo: { type: Object },
    assignTo: { type: mongoose.Types.ObjectId, ref: "user" },
    task: { type: mongoose.Types.ObjectId, ref: "task" },
    poNum: { type: String },
}, {
    timestamps: true
})

module.exports = mongoose.model("order", orderSchema)