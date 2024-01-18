module.exports = (sequelize, DataTypes) => {
    const users = sequelize.define('users', {
        first_name: {
            type: DataTypes.STRING,
            allowNull: true,
        }, last_name: {
            type: DataTypes.STRING,
            allowNull: true,
        }, email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }, username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }, phone_number: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }, password: {
            type: DataTypes.STRING,
            allowNull: false,
        }, address: {
            type: DataTypes.STRING,
            allowNull: true,
        }, profile_picture: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, { paranoid: true });
    users.associate = (models) => {
        users.belongsTo(models.clusters, {
            onUpdate: 'cascade',
            onDelete: 'cascade',
            foreignKey: 'clusterId'
        });
    }
    return users;
}