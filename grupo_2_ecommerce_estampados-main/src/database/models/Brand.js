module.exports = (sequelize, dataTypes) => {
    let alias = "Brand";
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
        is_active: {
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
            allowNull: true,
        }
    };
    let config = {
        timestamps: false,
        underscore: true
    };

    const Brand = sequelize.define(alias, columns, config);
    Brand.associate = function(models){
        Brand.hasMany(models.Product, {
            foreingKey: "brand_id"
        })
    }
    return Brand
}