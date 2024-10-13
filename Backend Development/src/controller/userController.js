const UserService = require('../services/userService');

exports.getUserById = async (req, res) => {
    try {
        const user = await UserService.getUserById(req.params.id);
        res.json(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.createUser = async (req, res) => {
    try {
        const newUser = await UserService.createUser(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).send(error.message);
    }
};
