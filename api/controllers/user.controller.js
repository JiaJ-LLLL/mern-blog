import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';
export const test = (req, res) => {
    res.json({
        message: 'Api is working!!'
    });
}

export const updateUser = async(req, res, next) => {
    // console.log(req);
    if (req.user.id !== req.params.userId) {
        return next(errorHandler(403, "You are not allowed to update this user"));
    }
    if (req.body.password) {
        const receivedPassword = req.body.password;
        if (receivedPassword.length < 6) {
            return next(errorHandler(403, 'Password must be at least 6 characters'));
        }

        req.body.password = bcryptjs.hashSync(receivedPassword, 10);
    
    }
    if (req.body.username) {
        const username = req.body.username;
        if (username.length < 7 || username.length > 20) {
            return next(errorHandler(400, 'Username name must be between 7 and 20 characters'));
        }
        if (username.includes(' ')) {
            return next(errorHandler(400, 'Username name can not include space'));
        }
        if (username !== username.toLowerCase()) {
            return next(errorHandler(400, 'Username name must be lower case'));
        }
        if (!username.match(/^[a-zA-Z0-9]+$/)) {
            return next(errorHandler(400, 'Username name can only contain letters and numbers'));
        }
    }

    try {
        // doesn't check for duplicate username
        // doesn't add same restriction when user sign up
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
            $set: {
                // set will update what included below
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                profilePicture: req.body.profilePicture
            }
        }, {new: true});
        const {password, ...rest} = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }

}