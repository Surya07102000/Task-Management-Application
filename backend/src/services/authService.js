const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userService = require('./userService');

const registerUser = async (name, email, password) => {
    const existing = await userService.getUserByEmail(email);
    if (existing) {
        throw new Error('Email already in use');
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await userService.createUser({
        name,
        email,
        password: hashed,
        role: 'user', // Default role
    });

    return { id: user.id, name: user.name, email: user.email };
};

const loginUser = async (email, password) => {
    const user = await userService.getUserByEmail(email, true);
    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'dev_secret',
        { expiresIn: '7d' }
    );

    return {
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
};

module.exports = {
    registerUser,
    loginUser,
};
