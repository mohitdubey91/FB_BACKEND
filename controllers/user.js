const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { validateEmail, validateLength, validateUsername } = require("../helpers/validation");
const { generateToken } = require('../helpers/tokens');
// const { sendVerificationEmail } = require("../helpers/mailer");

exports.register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            username,
            bYear,
            bMonth,
            bDay,
            gender,
        } = req.body;

        res.setHeader('Content-Type', 'application/json');

        if (!validateEmail(email)) {
            return res.status(400).send({ message: 'Invalid email' })
        }

        const check = await User.findOne({ email });

        if (check) {
            return res.status(400).send({ message: 'This email address already exists, try with a different email address' });
        }

        if (!validateLength(firstName, 3, 30)) {
            return res.status(400).send({ message: 'First name must between 3 and 30 characters' });
        }

        if (!validateLength(lastName, 3, 30)) {
            return res.status(400).send({ message: 'Last name must between 3 and 30 characters' });
        }

        if (!validateLength(password, 6, 40)) {
            return res.status(400).send({ message: 'Password must between 6 and 40 characters' });
        }

        const bcryptPassword = await bcrypt.hash(password, 12);

        let newUsername = await validateUsername(`${firstName}${lastName}`);

        const user = await new User({
            firstName,
            lastName,
            email,
            password: bcryptPassword,
            username: newUsername,
            bYear,
            bMonth,
            bDay,
            gender,
        }).save();

        const token = generateToken({ id: user._id.toString() }, "7d");
        // const url = `${process.env.BASE_URL}/activate/${emailVerificationToken}`;
        // sendVerificationEmail(user.email, user.firstName, url)
        return res.send({
            id: user._id,
            username: user.username,
            picture: user.picture,
            firstName: user.firstName,
            lastName: user.lastName,
            token,
            verified: user.verified,
            message: 'Register Success! Please active your email to start'
        });
    } catch (error) {
        res.status(400).send({
            message: error.message
        })
    }
}

exports.activeAccount = async (req, res) => {
    try {
        const { token } = req.body;
        const user = jwt.verify(token, process.env.TOKEN_SECRET);
        const check = await User.findById(user.id);

        if (check.verified === true) {
            return res.status(400).json({ message: 'this email is already activated' });
        }

        await User.findByIdAndUpdate(user.id, { verified: true });
        return res.status(200).json({ message: 'Account has been activated successfully!' });
    } catch (error) {
        res.status(400).send({
            message: error.message
        })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send({
                message: "The email address you entered is not connected to an account.",
            })
        }
        const check = await bcrypt.compare(password, user.password);
        if (!check) {
            return res.status(400).send({
                message: "Invalid credentials. Please try again.",
            })
        }
        const token = generateToken({ id: user._id.toString() }, "7d");
        return res.send({
            id: user._id,
            username: user.username,
            picture: user.picture,
            firstName: user.firstName,
            lastName: user.lastName,
            token,
            verified: user.verified,
            message: 'Login Success!'
        });
    } catch (error) {
        res.status(400).send({
            message: error.message
        })
    }
}