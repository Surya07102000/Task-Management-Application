const validateRegistration = (data) => {
    const errors = [];
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    }
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.push('Invalid email format');
    }
    if (!data.password || data.password.length < 6) {
        errors.push('Password must be at least 6 characters long');
    }
    return errors;
};

const validateLogin = (data) => {
    const errors = [];
    if (!data.email) errors.push('Email is required');
    if (!data.password) errors.push('Password is required');
    return errors;
};

module.exports = {
    validateRegistration,
    validateLogin,
};
