const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Task',
  tableName: 'tasks',
  columns: {
    id: { primary: true, type: 'int', generated: true },
    title: { type: 'varchar' },
    description: { type: 'text', nullable: true },
    status: { type: 'varchar', default: 'pending' },
    priority: { type: 'varchar', default: 'low' },
    dueDate: { type: 'timestamp', nullable: true },
    userId: { type: 'int' },
    createdAt: { type: 'timestamp', createDate: true },
    updatedAt: { type: 'timestamp', updateDate: true },
  },
  indices: [
    { name: 'IDX_TASK_USER', columns: ['userId'] },
  ],
});


