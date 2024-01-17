module.exports = (sequelize, DataTypes) => {
    const tasks = sequelize.define('tasks', {
        title: {
            type: DataTypes.STRING(100),
            allowNull: false,
        }, start_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        deadline_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        }, content: {
            type: DataTypes.TEXT,
            allowNull: false,
        }, thumbnail: {
            type: DataTypes.STRING,
            allowNull: false,
        }, status: {
            type: DataTypes.ENUM,
            values: ['Pending', 'Start', 'End'],
            allowNull: false,
        }
    });
    tasks.associate = (models) => {
        tasks.hasOne(models.tasks_detail, {
            onUpdate: 'cascade',
            onDelete: 'cascade',
        });
    }
    return tasks;
}