const { join } = require('path');
const sequelize = require('sequelize');
const path = require('path');
const urlApi = 'http://localhost:3000/api/products'
const urlImg = 'http://localhost:3000/img'

//declarando la base de datos
const db = require('../../database/models/index.js');
const { count } = require('console');
const dbBrands = db.Brand;
const dbCategories = db.Category;
const dbGenres = db.Genre;
const dbProducts = db.Product;
const dbSizes = db.Size;
const dbStock = db.Stock;
const limit = 10

const producstApiController = {

    list: async (req, res) =>{
        
        try {
            let page = req.query.page

            //si no se envía la página, por defecto es la 1
            if(!page){
                page = 1
            }

            let countProducts = await dbProducts.count()
            let cantPages = countProducts / limit
            cantPages = Number.isInteger(cantPages) ? cantPages : Math.floor(cantPages + 1) 

            //si la petición se realiza dentro de los rangos
            if (page > 0 && page <= cantPages){

                let offset = page * limit - limit

                let allProducts = await dbProducts.findAll({
                    attributes: ['id','name','img','price', 'created_date'],
                    limit: limit,
                    offset: offset
                });

                //añadir el detail a cada producto
                let products =  allProducts.map( element => {
                    return {
                        ...element['dataValues'],
                        detail : urlApi + '/' + element['dataValues']['id']
                    }
                })

                let countByCategoryAllProducts = await dbProducts.findAll({
                    attributes: [
                        [sequelize.fn('COUNT', sequelize.col('Category.id')),'total']
                    ],
                    include: [
                        {model: dbCategories,
                            required: true,
                            attributes: ['name']
                        }               
                    ],
                    group: 'Category.id'
                })

                let countByCategory = Object.fromEntries(
                    Object.values(countByCategoryAllProducts).map(element => {
                        return  [element['dataValues']['Category']['name'],element['dataValues']['total']]
                    })
                )

                let nextPage = parseInt(page) + 1
                let previousPage = parseInt(page) - 1
                let urlNextPage = urlApi + `/?page=${nextPage}`
                let urlPreviousPage = urlApi + `/?page=${previousPage}`

                let data = {
                    count: countProducts,
                    countByCategory: countByCategory,
                    next : urlNextPage,
                    previous : urlPreviousPage,
                    products: products
                }

                //Primera y última página - No requiere previous ni next url
                if (page == 1 && page == cantPages){
                    data.next = null
                    data.previous = null
                }
                //Primera página - No requiere previous url
                else if (page == 1){
                    data.previous = null
                }
                //Última página - No requiere next url
                else if (page == cantPages){
                    data.next = null
                }

                res.json(data)
            }
            //Responder con error
            else{
                res.status(404).json({
                    message: "404 Not Found",
                    status: 404})
            }
        }
        catch (e) {
            console.log({ name: e.name, message: e.message})
            res.status(404).json({
                message: "404 Not Found",
                status: 404})
        }
    },

    detail: async (req, res) =>{

        try {

            let oneProduct = await dbProducts.findByPk(req.params.id,{
                attributes: ['id','name','description','price','img','created_date'],
                include: [
                    {model: dbBrands,
                        required: true,
                        attributes: ['name']
                    },
                    {model: dbCategories,
                        required: true,
                        attributes: ['name']
                    },
                    {model: dbGenres,
                        required: true,
                        attributes: ['name']
                    }           
                ]
            })
            
            if (oneProduct) {

                let productSizes = await dbStock.findAll({
                    attributes: ['available_quantity'],
                    include: [
                        {model: dbSizes,
                            required: true,
                            attributes: ['size']
                        }
                    ],
                    where: {product_id: req.params.id}
                })
        
            //Ordenar el objeto de Stock
               let Stock = Object.values(productSizes).map(element => {
                    let available_quantity = element['dataValues']['available_quantity']
                    let size = element['dataValues']['Size']['dataValues']['size']
                    return {
                        size,
                        available_quantity
                    }
                })
            
                let product = {...oneProduct['dataValues'],
                    img : urlImg + '/' + oneProduct['dataValues']['img'],
                    Stock : Stock,
                    Brand: oneProduct['Brand']['dataValues']['name'],
                    Category: oneProduct['Category']['dataValues']['name'],
                    Genre: oneProduct['Genre']['dataValues']['name']
                }
                
                res.json(product)

            }else{
                res.status(404).json({
                    message: "404 Not Found",
                    status: 404})
            }
            
        }
        catch (e) {
            console.log({ name: e.name, message: e.message})
            res.status(404).json({
                message: "404 Not Found",
                status: 404})
        }

    }
    
}

module.exports = producstApiController
