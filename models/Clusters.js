module.exports = (sequelize, DataTypes) => {
    const clusters = sequelize.define('clusters', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        }, description: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, { paranoid: true });
    clusters.associate = (models) => {
        clusters.hasMany(models.users);
    }
    return clusters;
}