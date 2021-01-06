const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/Auth1');

const User = require('../models/User1');

const router = express.Router();

//@route    /api/auth1
//@desc     Log in a user
//@access   Public
router.post('/', [
    body('email', 'Please enter a valid email').isEmail(),
    body('password', 'Password must not be empty').not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.json(errors.array());
    } 

    const { email, password } = req.body;
    try {
        const user = await User.findOne({email});
    if(!user) {
        return res.status(401).json({ msg: "Invalid Email"});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
        return res.status(401).json({ msg: "Invalid Credentials"});
    }

    const payload = {
        user: {
            id: user.id
        }
    }

    await jwt.sign(payload, config.get('jwtSecret'), {
        expiresIn: 360000
    }, (err, token) => {
        if(err) throw err;
        res.json({ token})
    })
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ msg: 'Server Error'})
    }

});

//@route    /api/auth1
//@desc     Get logged in a user
//@access   Private
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        res.status(400).json(user);
    } catch (err) {
        console.log(err.message);
        res.status(500).json("Server Error");
    }
});

module.exports = router;