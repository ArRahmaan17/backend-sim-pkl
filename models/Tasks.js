module.exports = (sequelize, DataTypes) => {
    const tasks = sequelize.define('tasks', {
        title: {
            type: DataTypes.STRING(100),
            allowNull: true,
        }, start_date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        deadline_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            unique: true
        }, group: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }, content: {
            type: DataTypes.TEXT,
            allowNull: false,
        }, thumbnail: {
            type: DataTypes.STRING,
            allowNull: false,
        }, status: {
            type: DataTypes.ENUM,
            values: ['Pending', 'Start', 'End'],
            allowNull: true,
        }
    });
    // tasks.associate = (models) => {
    //     tasks.hasOne(models.attendances, {
    //         onUpdate: 'cascade',
    //         onDelete: 'cascade',
    //     });
    // }
    return tasks;
}