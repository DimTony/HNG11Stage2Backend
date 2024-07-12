const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('../../db');

const createUser = async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;

  try {
    // Check if the email is already in use
    const emailCheck = await db.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);
    if (emailCheck.rows.length > 0) {
      return res.status(422).json({
        status: 'error',
        message: 'Email already in use',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user's organization name
    const orgName = `${firstName}'s Organisation`;
    const client = await db.connect();
    try {
      await client.query('BEGIN');

      const userId = uuidv4();
      const orgId = uuidv4();

      // Insert user into users table with initial organization
      const userResult = await client.query(
        'INSERT INTO users ("userId", "firstName", "lastName", "email", "password", "phone", "organisations") VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [userId, firstName, lastName, email, hashedPassword, phone, [orgId]]
      );

      // Insert organization into organizations table
      const orgResult = await client.query(
        'INSERT INTO organisations ("orgId", "name", "description") VALUES ($1, $2, $3) RETURNING *',
        [orgId, orgName, `${firstName}'s default organisation`]
      );

      // Commit the transaction
      await client.query('COMMIT');

      // Generate JWT token
      const accessToken = jwt.sign(
        { userId: userResult.rows[0].userId, email: userResult.rows[0].email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Token expires in 1 hour
      );

      // Prepare response
      const responseData = {
        status: 'success',
        message: 'Registration successful',
        data: {
          accessToken,
          user: {
            userId: userResult.rows[0].userId,
            firstName: userResult.rows[0].firstName,
            lastName: userResult.rows[0].lastName,
            email: userResult.rows[0].email,
            phone: userResult.rows[0].phone,
          },
        },
      };

      res.status(201).json(responseData);
    } catch (error) {
      // Rollback transaction on error
      await client.query('ROLLBACK');
      console.error('Error creating user:', error);
      res.status(400).json({
        status: 'Bad request',
        message: 'Registration unsuccessful',
        statusCode: 400,
      });
    } finally {
      // Release the client back to the pool
      client.release();
    }
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      status: 'Internal server error',
      message: 'Failed to create user',
      statusCode: 500,
    });
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('SELECT * FROM users WHERE userId = $1', [
      id,
    ]);
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ errors: [{ field: 'userId', message: 'User not found' }] });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      errors: [{ field: 'server', message: 'Internal server error' }],
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the email exists
    const userResult = await db.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({
        status: 'Bad request',
        message: 'Authentication failed',
        statusCode: 401,
      });
    }

    const user = userResult.rows[0];

    // Compare the password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        status: 'Bad request',
        message: 'Authentication failed',
        statusCode: 401,
      });
    }

    // Generate a JWT token
    const token = jwt.sign(
      {
        userId: user.userId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send the successful login response
    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        accessToken: token,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({
      status: 'Bad request',
      message: 'Authentication failed',
      statusCode: 401,
    });
  }
};

module.exports = { createUser, getUser, loginUser };
