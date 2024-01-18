module.exports = (sequelize, DataTypes) => {
    const attendances = sequelize.define('attendances', {
        photo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('IN', "SICK", 'ABSENT', 'OUT'),
            allowNull: false
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, { paranoid: true });
    attendances.associate = (models) => {
        attendances.belongsTo(models.users, {
            onUpdate: 'cascade',
            onDelete: 'cascade',
        });
    }
    return attendances;
}