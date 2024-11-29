const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 2,
        max: 50
    },
    picture: {
        type: String,
        default:""
    },
    location: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 5
    }
}, { timestamps: true });

const User = mongoose.model("User", UserSchema); 

module.exports = User;
