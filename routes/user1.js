const express = require('express');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const User = require('../models/User1');
const { body, validationResult } = require('express-validator');

const router = express.Router();

//@route    /api/user1
//@desc     Register a user
//@access   Public
router.post('/', [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please provide a valid Email').isEmail(),
    body('password', 'Password must be 6 or more characters').isLength({
        min: 6
    }),
] , async (req, res) => {
    const error = validationResult(req);

    if(!error.isEmpty()) {
        res.json(error.array());
    }

    const { name, email, password } = req.body;

    try {
        const user = await User.findOne({email});
        if(user) {
            return res.status(401).json({ msg: "Email Already Exists" });
        }

        const newUser = new User({
            name, email, password
        });

        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);
        await newUser.save();

        const payload = {
            user: {
                id: newUser.id
            }
        };

        await jwt.sign(payload, config.get('jwtSecret'), {
            expiresIn: 360000
        }, (error, token) => {
            if(error) throw error;
            res.json({token});
        })
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ msg: "Server Error"})
    }
});

module.exports = router