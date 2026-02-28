const { AppDataSource } = require('../config/data-source');

const taskRepo = AppDataSource.getRepository('Task');

const createTask = async (taskData) => {
    const task = taskRepo.create(taskData);
    return await taskRepo.save(task);
};

const getTasksByUserId = async (userId) => {
    return await taskRepo.find({
        where: { userId },
        order: { createdAt: 'DESC' },
    });
};

const getTaskByIdAndUser = async (id, userId) => {
    return await taskRepo.findOne({
        where: { id: parseInt(id), userId },
    });
};

const updateTask = async (id, userId, taskData) => {
    const task = await taskRepo.findOne({
        where: { id: parseInt(id), userId },
    });
    if (!task) return null;

    taskRepo.merge(task, taskData);
    return await taskRepo.save(task);
};

const deleteTask = async (id, userId) => {
    return await taskRepo.delete({ id: parseInt(id), userId });
};

module.exports = {
    createTask,
    getTasksByUserId,
    getTaskByIdAndUser,
    updateTask,
    deleteTask,
};
