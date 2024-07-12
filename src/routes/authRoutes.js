const express = require('express');
const {
  createUser,
  getUser,
  loginUser,
} = require('../controllers/authController');
const { validateUser, validateLogin } = require('../middlewares/validate');

const router = express.Router();

router.post('/register', validateUser, createUser);
router.post('/login', validateLogin, loginUser);

module.exports = router;
