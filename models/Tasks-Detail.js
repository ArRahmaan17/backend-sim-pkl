module.exports = (sequelize, DataTypes) => {
    const tasks_detail = sequelize.define('tasks_detail', {
        link: {
            type: DataTypes.STRING,
            allowNull: true,
        }, file: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM("START", "ANALYTIC", "DEVELOPMENT", "DONE"),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, { paranoid: true });
    tasks_detail.associate = (models) => {
        tasks_detail.belongsTo(models.tasks, {
            onUpdate: 'cascade',
            onDelete: 'cascade',
        });
        tasks_detail.belongsTo(models.users, {
            onUpdate: 'cascade',
            onDelete: 'cascade',
        });
    }
    return tasks_detail;
}
