module.exports = (sequelize, dataTypes) => {
    let alias = "Stock";
    let columns = {
        id: {
            type: dataTypes.INTEGER(11),
            primaryKey: true,
            allowNull: false,
            autoIncrement: true

        },
        product_id:{
            type: dataTypes.INTEGER(11),
            allowNull: true
        },
        size_id:{
            type: dataTypes.INTEGER(11),
            allowNull: true
        },
        available_quantity: {
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
        tableName: "stock",
        timestamps: false,
        underscored: true
    };

    const Stock = sequelize.define(alias, columns, config);
    Stock.associate = function(models){
        Stock.belongsTo(models.Product, {
            foreingKey: "product_id"
        }),
        Stock.belongsTo(models.Size, {
            foreingKey: "size_id"
        })
    }
    return Stock;
}