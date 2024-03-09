import mongoose from "mongoose";

// This is kind like the user object, which also add constrains on the object. 
// userResp + Validation in spring boot
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;