const UserModel = require('../models/User'); 
const bcrypt = require('bcrypt');


exports.userLogin = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    
    const User = await UserModel.findUnique({
     where: { email },
    });

    if (!user) {
        return res.status(401).json({ error: 'Incorrect email/password' });
      }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Incorrect email/password' });
    }

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error login in:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
