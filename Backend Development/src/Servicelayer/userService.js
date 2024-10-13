const UserModel = require('../models/userModel');

exports.getUserById = async (id) => {
    return await UserModel.findById(id);
};

exports.createUser = async (userData) => {
    const user = new UserModel(userData);
    return await user.save();
};
