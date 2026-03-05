module.exports = (sequelize, dataTypes) => {
    let alias = "Cart";
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
        order_id: {
            type: dataTypes.INTEGER(11),
            allowNull: false,
        },
        product_id: {
            type: dataTypes.INTEGER(11),
            allowNull: false,
        },
        product_quantity: {
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

    const Cart = sequelize.define(alias, columns, config);
    return Cart
}