import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const userSignUp = async (req, res) => {
    const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword
    } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        
        if (existingUser) {
            return res.status(400).json({ message: "User email already exists."});
        }
        
        if (`${confirmPassword}` !== `${password}`) {
            console.log(confirmPassword, password);
            return res.status(400).json({ message: "Password not match."});
        }


        const hashedPassword = await bcrypt.hash(password, 12);
        const result = await User.create({ firstName, lastName, email, password: hashedPassword});
        const token = jwt.sign({
            email: email,
            id: result._id
        }, 'testsecret', { expiresIn: '1hr' });

        res.status(200).json({ result, token });
    } catch (error) {
        res.status(500).json(error);
    }
}

export const userSignIn = async (req, res) => {
    const {email, password} = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) res.status(404).json({ message: "User doesn't exist."});
        
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) res.status(400).json({ message: "Invalid user credentials."});

        const token = jwt.sign({
            email: existingUser.email,
            id: existingUser._id
        }, 'testsecret', { expiresIn: '1hr' });

        res.status(200).json({ result: existingUser, token: token });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong."});
    }
}
