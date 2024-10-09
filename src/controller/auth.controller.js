const jwt = require('jsonwebtoken');
const prisma = require('../../dbConfig/index');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = process.env.JWT_EXPIRY;

console.log('secret', JWT_SECRET);
console.log('expiry', JWT_EXPIRY);

exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    });
    console.log('new user is: ', newUser);
    res.status(201).json({ user: newUser });
  } catch (error) {
    console.log('Error is: ', error);
    res.status(500).json({ error: 'Error creating user' });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid Email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRY,
    });

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid Email or password' });
    }

    res.status(200).json({ message: `Login successful ${user.firstName}`, token });
  } catch (error) {
    console.log('Error is: ', error);
    res.status(500).json({ error: 'Error logging in user' });
  }
};
