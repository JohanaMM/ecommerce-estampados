module.exports = (sequelize, dataTypes) => {
    let alias = "Size";
    let columns = {
        id: {
            type: dataTypes.INTEGER(11),
            primaryKey: true,
            allowNull: false,
            autoIncrement: true

        },
        size: {
            type: dataTypes.STRING(45),
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
        tableName: "sizes",
        timestamps: false,
        underscored: true
    };

    const Size = sequelize.define(alias, columns, config);
    Size.associate = function(models){
        Size.hasMany(models.Stock, {
            foreignKey: "size_id"
        })
    }
    return Size;
}