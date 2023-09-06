const mongoose = require("mongoose")
// const uniqueValidator = require("mongoose-unique-validator")

const schema = mongoose.Schema

const userSchema = schema({
    title: { type: String },
    body: { type: String },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
}, {
    timestamps: true
})


module.exports = mongoose.model("notification", userSchema)