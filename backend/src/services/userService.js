const { AppDataSource } = require('../config/data-source');
const User = require('../entity/User');

const userRepo = AppDataSource.getRepository('User');

const getAllUsers = async () => {
    return await userRepo.find();
};

const getUserById = async (id) => {
    return await userRepo.findOneBy({ id: parseInt(id) });
};

const createUser = async (userData) => {
    const user = userRepo.create(userData);
    return await userRepo.save(user);
};

const updateUser = async (id, userData) => {
    const user = await userRepo.findOneBy({ id: parseInt(id) });
    if (!user) return null;
    userRepo.merge(user, userData);
    return await userRepo.save(user);
};

const deleteUser = async (id) => {
    return await userRepo.delete(id);
};

const getUserByEmail = async (email, selectPassword = false) => {
    if (selectPassword) {
        return await userRepo
            .createQueryBuilder('user')
            .addSelect('user.password')
            .where('user.email = :email', { email })
            .getOne();
    }
    return await userRepo.findOne({ where: { email } });
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getUserByEmail,
};
