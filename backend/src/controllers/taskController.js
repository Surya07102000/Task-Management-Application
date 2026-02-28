const taskService = require('../services/taskService');
const taskDto = require('../dtos/taskDto');

exports.createTask = async (req, res) => {
  try {
    const errors = taskDto.validateTask(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    const { title, description, dueDate, status, priority } = req.body;
    const result = await taskService.createTask({
      title,
      description: description || null,
      dueDate: dueDate || null,
      status: status || 'pending',
      priority: priority || 'low',
      userId: req.user.userId,
    });
    return res.status(201).json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const list = await taskService.getTasksByUserId(req.user.userId);
    return res.json(list);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await taskService.getTaskByIdAndUser(req.params.id, req.user.userId);
    return task ? res.json(task) : res.status(404).json({ message: 'Task not found' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const errors = taskDto.validateUpdateTask(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    const result = await taskService.updateTask(req.params.id, req.user.userId, req.body);
    if (!result) return res.status(404).json({ message: 'Task not found' });
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const result = await taskService.deleteTask(req.params.id, req.user.userId);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


