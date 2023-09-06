const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")

const schema = mongoose.Schema

const userSchema = schema({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: [{ type: String, default: "client" }],
    status: { type: String, default: "active" },
    head: { type: schema.Types.ObjectId, ref: "user" },
    isDeleted: { type: Boolean, default: false },
    editorRequest: { type: String },
    requestedRole: [{ type: String }],
    wallet: { type: Number, default: 0 },
}, {
    timestamps: true
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model("user", userSchema)