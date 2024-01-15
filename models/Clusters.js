module.exports = (sequelize, DataTypes) => {
    const clusters = sequelize.define('clusters', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        }, description: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });
    clusters.associate = (models) => {
        clusters.hasOne(models.users, {
            onUpdate: 'cascade',
            onDelete: 'cascade',
        });
    }
    return clusters;
}