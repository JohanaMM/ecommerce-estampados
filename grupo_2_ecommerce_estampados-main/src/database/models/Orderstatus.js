module.exports = (sequelize, dataTypes) => {
    let alias = "Orderstatus";
    let columns = {
        id: {
            type: dataTypes.INTEGER(11),
            primaryKey: true,
            allowNull: false,
            autoIncrement: true

        },
        name: {
            type: dataTypes.STRING(500),
            allowNull: false,
        },
        created_date: {
            type: dataTypes.DATE,
        defaultValue: dataTypes.NOW,
            allowNull: false,
        },
        modified_date: {
            type: dataTypes.DATE,
            allowNull: true,
        }
    };
    let config = {
        timestamps: false,
        underscore: true,
        freezeTableName: true
    };

    const Orderstatus = sequelize.define(alias, columns, config);
    return Orderstatus
}