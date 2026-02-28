const authService = require('../services/authService');
const authDto = require('../dtos/authDto');

exports.register = async (req, res) => {
  try {
    const errors = authDto.validateRegistration(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    const { name, email, password } = req.body;
    const result = await authService.registerUser(name, email, password);
    return res.status(201).json(result);
  } catch (err) {
    if (err.message === 'Email already in use') {
      return res.status(409).json({ message: err.message });
    }
    return res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const errors = authDto.validateLogin(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    return res.json(result);
  } catch (err) {
    if (err.message === 'Invalid credentials') {
      return res.status(401).json({ message: err.message });
    }
    return res.status(500).json({ message: err.message });
  }
};


