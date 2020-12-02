const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    avatarURL: { type: String},
    subscription: {
        type: String, 
        enum: ["free", "pro", "premium"],
        default: "free"
    },
    token: { type: String, default: '' },
    verificationToken: {type: String, required: false}
})
exports.UserModel = mongoose.model("User", userSchema, 'users')