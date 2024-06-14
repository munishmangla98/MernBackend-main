const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ error: 'User already exists' });
      }
  
      user = new User({
        name,
        email,
        password
      });
  
      // Save the user
      await user.save();
  
      // Generate token
      const token = await user.generateAuthToken();
      res.status(201).json({ token });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: 'Invalid email credentials' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      // console.log('Provided password:', password); // Log provided password
      // console.log('Stored hashed password:', user.password); // Log stored hashed password
      // console.log('Password match:', isMatch); // Log password comparison result
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid password credentials' });
      }
  
      const token = await user.generateAuthToken();
      res.json({ token,
        _id: user._id,
        name: user.name
       });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };
