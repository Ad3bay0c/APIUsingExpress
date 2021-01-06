const express = require('express');
const router = express.Router();
const config = require('config');
const Auth = require('../middleware/Auth');

const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');

// @route   GET api/contacts
// @desc    Get all users contacts
// @access  Private
router.get('/', Auth, async (req, res) => {
    try {
        const contacts = await Contact.find({  user: req.user.id }).sort({ date: -1 });
        
        res.json(contacts);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ msg: "Server Error" });
    }
});

// @route   POST api/contacts
// @desc    Add new Contact
// @access  Private
router.post('/', [ Auth, [
    body('name','Name is required').not().isEmpty()
]] , async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.json({ errors: errors.array()  });
    }

    const { name, email, phone, type } = req.body;

    try {
        const contact = new Contact({
            name,
            email,
            phone,
            type,
            user: req.user.id
        });

        const newContact = await contact.save();

        res.json(newContact);

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ msg: "Server Error" });
    }
    res.send('Add contact');
});

// @route   PUT api/contacts/:id
// @desc    Update Contact
// @access  Public
router.put('/:id', (req, res) => {
    res.send('Update Contact ');
});

// @route   DELETE api/contacts/:id
// @desc    Delete Contact
// @access  Public
router.delete('/:id', (req, res) => {
    res.send('Delete Contact');
});

module.exports = router;