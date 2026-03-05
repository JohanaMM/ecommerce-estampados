module.exports = (sequelize, dataTypes) => {
    let alias = "Order";
    let columns = {
        id: {
            type: dataTypes.INTEGER(11),
            primaryKey: true,
            allowNull: false,
            autoIncrement: true

        },
        user_id: {
            type: dataTypes.INTEGER(11),
            allowNull: false,
        },
        total: {
            type: dataTypes.INTEGER(11),
            allowNull: false,
        },
        status_id: {
            type: dataTypes.INTEGER(11),
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

    const Order = sequelize.define(alias, columns, config);
    return Order;
}