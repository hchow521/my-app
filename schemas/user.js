let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

module.exports = new Schema({
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    loginAttempts: { type: Number, required: true, default: 0 },//登陆尝试
    lockUntil: { type: Number }//锁定
});