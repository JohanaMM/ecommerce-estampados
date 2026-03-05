module.exports = (sequelize, dataTypes) => {
    let alias = "Category";
    let columns = {
        id: {
            type: dataTypes.INTEGER(11),
            primaryKey: true,
            allowNull: false,
            autoIncrement: true

        },
        name: {
            type: dataTypes.STRING(45),
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
        }
    };
    let config = {
        timestamps: false,
        underscore: true
    };

    const Category = sequelize.define(alias, columns, config);
    Category.associate = function(models){
        Category.hasMany(models.Product, {
            foreingKey: "category_id"
        })
    }
    return Category;
}