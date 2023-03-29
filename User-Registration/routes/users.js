 
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User, validate } = require('../models/user');

router.post('/', async (req, res) => {
  console.log('POST request received');
  try {
    // Validate the request
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    // Check if the user already exists
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).send('That user already exists!');
    }

    // Create a new user
    user = new User({
      name: req.body.name,
      unit: req.body.unit,
      email: req.body.email,
      password: req.body.password
    });

    // Hash the password before saving the user to the database
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    // Send the response
    res.send(user);
  } catch (error) {
    // Handle server errors
    console.error(error);
    res.status(500).send('Internal server error.');
  }
});

module.exports = router;
