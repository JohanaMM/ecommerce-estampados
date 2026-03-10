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
            type: dataTypes.TEXT,
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
        images: {
            type: dataTypes.TEXT,
            allowNull: true
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
        theme: {
            type: dataTypes.STRING(60),
            allowNull: true
        },
        color: {
            type: dataTypes.STRING(60),
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
            foreignKey: 'product_id'
        }),
        Product.belongsTo(models.Category, { foreignKey: "category_id" }),
        Product.belongsTo(models.Genre, { foreignKey: "genre_id" }),
        Product.belongsTo(models.Brand, { foreignKey: "brand_id" })
    }
    return Product;
}