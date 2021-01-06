const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const Auth = require('../middleware/Auth');

const { body, validationResult } = require('express-validator');

const router = express.Router();

// @route   POST api/auth
// @desc    Get Logged in User
// @access  Public
router.post('/', [
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Password must be 6 or mor characters').exists()
],  
async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({email});

        if(!user) {
            return res.status(400).json({
                message: "Invalid Credentials"
            })
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.status(400).json({ message: "Wrong Password"});
        }


        const payload = {
            user: {
                id: user.id
            }
            
        }
        jwt.sign(payload, config.get('jwtSecret'), {
            expiresIn: 360000
        }, (err, token) => {
            if(err) throw err;
            res.json(token)
        })
    }catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

// @route   GET api/auth
// @desc    Auth User & get token
// @access  Private
router.get('/', Auth,  async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;