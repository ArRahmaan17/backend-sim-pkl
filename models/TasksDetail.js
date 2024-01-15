module.exports = (sequelize, DataTypes) => {
    const tasksDetail = sequelize.define('tasks_detail', {
        link: {
            type: DataTypes.STRING,
            allowNull: true,
        }, file: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    });
    tasksDetail.associate = (models) => {
        tasksDetail.belongsTo(models.users, {
            onUpdate: 'cascade',
            onDelete: 'cascade',
        });
        tasksDetail.belongsTo(models.tasks, {
            onUpdate: 'cascade',
            onDelete: 'cascade',
        });
    }
    return tasksDetail;
}
