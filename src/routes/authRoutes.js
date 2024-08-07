import express from 'express';
import bcrypt from 'bcrypt';
// A JSON Web Token (JWT) is a small piece of data that is used to prove that a user is
// who they say they are. It helps in making sure the right person is accessing the
// right things on a website or app.
import jwt from 'jsonwebtoken';
import dbQueryWithData from '../helper/helper.js';

const authRouter = express.Router();
const usersColumns = 'id, name, email, password, avatar_url';
// Number of salt rounds used for hashing the password. Nuo atakų kažkas,
// didesnis geriau, bet lėčiau.
const saltRounds = 10;
// Secret key for signing the JWT (JSON Web Token)
const jwtSecret = 'your_jwt_secret'; // It's recommended to store this in an environment variable

// POST /api/auth/register - Register a new user
authRouter.post('/register', async (req, res) => {
  // Extracting user details from the request body
  const {
    name, email, password, avatar_url,
  } = req.body;

  try {
    // Hashing the password using bcrypt with a specified number of salt rounds
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const sql = `INSERT INTO vartotojai (name, email, password, avatar_url) VALUES (?, ?, ?, ?)`;
    const [row, error] = await dbQueryWithData(sql, [name, email, hashedPassword, avatar_url]);

    if (error) {
      console.warn('post rows error ===', error);
      return res.status(400).json({ error: 'Error registering user' });
    }

    // Responding with a status of 201 (Created) and returning the new user's details
    res.status(201).json({
      id: row.insertId, name, email, avatar_url,
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/login - Login a user
authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const sql = `SELECT ${usersColumns} FROM vartotojai WHERE email = ?`;
    const [users, error] = await dbQueryWithData(sql, [email]);

    if (error || users.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const user = users[0];
    // Comparing the plain-text password with the hashed password stored in the database
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Generating a JWT (JSON Web Token) with the user's id and email, expiring in 1 hour
    const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: '1h' });

    res.json({
      token,
      user: {
        id: user.id, name: user.name, email: user.email, avatar_url: user.avatar_url,
      },
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/auth/user/:id - Update user information
authRouter.put('/user/:id', async (req, res) => {
  const userId = req.params.id;
  const { name, email, avatar_url } = req.body;

  try {
    const sql = `UPDATE vartotojai SET name = ?, email = ?, avatar_url = ? WHERE id = ?`;
    const [result, error] = await dbQueryWithData(sql, [name, email, avatar_url, userId]);

    if (error) {
      console.warn('update user error ===', error);
      return res.status(400).json({ error: 'Error updating user' });
    }

    res.json({ msg: `User with id '${userId}' was updated` });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default authRouter;
