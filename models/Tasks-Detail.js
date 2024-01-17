module.exports = (sequelize, DataTypes) => {
    const tasks_detail = sequelize.define('tasks_detail', {
        link: {
            type: DataTypes.STRING,
            allowNull: true,
        }, file: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    });
    // details.associate = (models) => {
    //     details.hasOne(models.users, {
    //         onUpdate: 'cascade',
    //         onDelete: 'cascade',
    //     });
    // }
    return tasks_detail;
}
