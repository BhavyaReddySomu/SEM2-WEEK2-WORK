const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

router.get('/users/:id', UserController.getUserById);
router.post('/users', UserController.createUser);

module.exports = router;
