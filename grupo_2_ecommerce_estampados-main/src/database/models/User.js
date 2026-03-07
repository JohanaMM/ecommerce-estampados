module.exports = (sequelize, dataTypes) => {
    let alias = "User";
    let columns = {
        id: {
            type: dataTypes.INTEGER(11),
            primaryKey: true,
            allowNull: false,
            autoIncrement: true

        },
        first_name: {
            type: dataTypes.STRING(100),
            allowNull: false,
        },
        last_name: {
            type: dataTypes.STRING(100),
            allowNull: false,
        },
        email: {
            type: dataTypes.STRING(100),
            allowNull: false,
        },
        password: {
            type: dataTypes.STRING(100),
            allowNull: false,
        },
        avatar_img: {
            type: dataTypes.STRING(100),
            allowNull: false,
        },
        phone: {
            type: dataTypes.STRING(30),
            allowNull: true,
        },
        address_street: {
            type: dataTypes.STRING(200),
            allowNull: true,
        },
        address_number: {
            type: dataTypes.STRING(20),
            allowNull: true,
        },
        address_depto: {
            type: dataTypes.STRING(50),
            allowNull: true,
        },
        address_province: {
            type: dataTypes.STRING(100),
            allowNull: true,
        },
        address_city: {
            type: dataTypes.STRING(100),
            allowNull: true,
        },
        address_postal_code: {
            type: dataTypes.STRING(20),
            allowNull: true,
        },
        role_id: {
            type: dataTypes.INTEGER(11),
            allowNull: false,
        },
        is_active: {
            type: dataTypes.STRING(11),
            allowNull: false,
        },
        created_date: {
            type: dataTypes.DATE,
            defaultValue: dataTypes.NOW,
            allowNull: false,
        },
        modified_date: {
            type: dataTypes.DATE,
        }
    };
    let config = {
        timestamps: false,
        underscore: true
    };

    const User = sequelize.define(alias, columns, config);
    return User;
}