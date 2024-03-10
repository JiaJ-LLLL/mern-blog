import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';

export const signup = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password || username == '' || email == '' || password == '') {
        return res.status(400).json({ message: "All fields are required." });
    }
    
    // hash the password and salted it 10 times.
    const hashedPassowrd = bcryptjs.hashSync(password, 10);

    const newUser = new User({
        username,
        email,
        password: hashedPassowrd,
    });

    try {
        // stop the execution of signup and await the newUser is saved 
        await newUser.save();
        res.json({ message: 'Signup success.'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }

};