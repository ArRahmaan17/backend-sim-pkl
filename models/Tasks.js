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
    }, { paranoid: true });
    tasks.associate = (models) => {
        tasks.belongsTo(models.clusters, {
            onUpdate: 'cascade',
            onDelete: 'cascade',
        });
        tasks.belongsTo(models.users, {
            onUpdate: 'cascade',
            onDelete: 'cascade',
        });
        tasks.hasMany(models.tasks_detail);
    }
    return tasks;
}