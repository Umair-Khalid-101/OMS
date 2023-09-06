const mongoose = require("mongoose")

const schema = mongoose.Schema

const taskSchema = schema({
    assignTo: { type: mongoose.Types.ObjectId, ref: "user" },
    designer: { type: mongoose.Types.ObjectId, ref: "user" },
    status: { type: String, default: "active" },
    review: { type: String },
    managerReview: { type: String },
    note: { type: String },
    design: { type: String },
    submittedBy: { type: String },
    order: { type: mongoose.Types.ObjectId, ref: "order" },
    printer: { type: mongoose.Types.ObjectId, ref: "user" },
    delivery: { type: mongoose.Types.ObjectId, ref: "user" },
}, {
    strictPopulate: false,
    timestamps: true
})


module.exports = mongoose.model("task", taskSchema)