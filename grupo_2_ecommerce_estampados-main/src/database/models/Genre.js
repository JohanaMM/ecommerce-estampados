module.exports = (sequelize, dataTypes) => {
    let alias = "Genre";
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

    const Genre = sequelize.define(alias, columns, config);
    Genre.associate = function(models){
        Genre.hasMany(models.Product, {
            foreingKey: "genre_id"
        })
    }
    return Genre;
}