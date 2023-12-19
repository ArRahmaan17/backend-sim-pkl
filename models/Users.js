module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define('Users', {
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
    })
    return Users;
}