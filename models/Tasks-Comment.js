module.exports = (sequelize, DataTypes) => {
    const tasks_comment = sequelize.define('tasks_comment', {
        content: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, { paranoid: true });
    tasks_comment.associate = (models) => {
        tasks_comment.belongsTo(models.tasks, {
            onUpdate: 'cascade',
            onDelete: 'cascade',
        })
        tasks_comment.belongsTo(models.users, {
            onUpdate: 'cascade',
            onDelete: 'cascade',
        })
    }
    return tasks_comment;
}