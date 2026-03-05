module.exports = (sequelize, dataTypes) => {
    let alias = 'Product';
    let columns = {
        id: {
            type: dataTypes.INTEGER(11),
            primaryKey: true,
            allowNull: false,
            autoIncrement: true

        },
        name: {
            type: dataTypes.STRING(100),
            allowNull: false
        },
        description: {
            type: dataTypes.STRING(100),
            allowNull: false
        },
        price: {
            type: dataTypes.INTEGER(11),
            allowNull: false
        },
        img: {
            type: dataTypes.STRING(100),
            allowNull: false
        },
        is_active: {
            type: dataTypes.INTEGER(11),
            allowNull: false
        },
        category_id:{
            type: dataTypes.INTEGER(11),
            allowNull: true
        },
        brand_id:{
            type: dataTypes.INTEGER(11),
            allowNull: true
        },
        genre_id:{
            type: dataTypes.INTEGER(11),
            allowNull: true
        },
        created_date: {
            type: dataTypes.DATE,
            defaultValue: dataTypes.NOW,
            allowNull: false,
        },
        modified_date: {
            type: dataTypes.DATE,
            allowNull: true
        }
    };
    let config = {
        tableName: 'products',
        timestamps: false,
        underscored: true
    };

    const Product = sequelize.define(alias, columns, config);
    Product.associate = function(models){
        Product.hasMany(models.Stock, {
            foreingKey: 'product_id'
        }),
        Product.belongsTo(models.Category, {
            foreingKey: 'category_id',
            uniqueKey: 'FK_products_category'
        }),
        Product.belongsTo(models.Genre, {
            foreingKey: 'genre_id',
            uniqueKey: 'FK_products_genre'
        }),
        Product.belongsTo(models.Brand, {
            foreingKey: 'brand_id',
            uniqueKey: 'FK_products_brand'
        })
    }
    return Product;
}