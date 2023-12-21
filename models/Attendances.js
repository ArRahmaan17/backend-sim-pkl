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
    });
    return attendances;
}