const validateTask = (data) => {
    const errors = [];
    if (!data.title || data.title.trim().length === 0) {
        errors.push('Title is required');
    }
    if (data.status && !['pending', 'in-progress', 'completed'].includes(data.status)) {
        errors.push('Invalid status. Must be pending, in-progress, or completed');
    }
    if (data.priority && !['low', 'medium', 'high'].includes(data.priority)) {
        errors.push('Invalid priority. Must be low, medium, or high');
    }
    if (data.dueDate && isNaN(Date.parse(data.dueDate))) {
        errors.push('Invalid due date format');
    }
    return errors;
};

const validateUpdateTask = (data) => {
    const errors = [];
    if (data.title !== undefined && data.title.trim().length === 0) {
        errors.push('Title cannot be empty');
    }
    if (data.status && !['pending', 'in-progress', 'completed'].includes(data.status)) {
        errors.push('Invalid status. Must be pending, in-progress, or completed');
    }
    if (data.priority && !['low', 'medium', 'high'].includes(data.priority)) {
        errors.push('Invalid priority. Must be low, medium, or high');
    }
    if (data.dueDate && isNaN(Date.parse(data.dueDate))) {
        errors.push('Invalid due date format');
    }
    return errors;
};

module.exports = {
    validateTask,
    validateUpdateTask,
};
