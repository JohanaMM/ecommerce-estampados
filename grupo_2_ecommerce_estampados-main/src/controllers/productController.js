const { join } = require('path');
const sequelize = require('sequelize');
const path = require('path');
const fs = require('fs');
const { check, validationResult } = require("express-validator");

//declarando la base de datos
const db = require('../database/models/index.js')
const dbBrands = db.Brand;
const dbCategories = db.Category;
const dbGenres = db.Genre;
const dbProducts = db.Product;
const dbSizes = db.Size;
const dbStock = db.Stock;

const productController = {

    list: async (req, res) =>{
        
        let products = await dbProducts.findAll({
            include: [
                {model: dbCategories,
                    required: true,
                    attributes: ['name'],
                    where: {is_active: 1}
                },
                {model: dbGenres,
                    required: true,
                    attributes: ['name']
                },
                {model: dbBrands,
                    required: true,
                    attributes: ['name']
                }
            ],
            where: {is_active: 1}
        });

        let stock = await dbStock.findAll({
            attributes: ['available_quantity'],
            include: [
                {model: dbProducts,
                    required: true,
                    attributes: ['name', 'description','img','price'],
                    where: {is_active: 1}
                },
                {model: dbSizes,
                    required: true,
                    attributes: ['size']
                }
            ]
        });

        //para los filtros (en un futuro)
        let genres = await dbGenres.findAll();
        let categories = await dbCategories.findAll();
        let brands = await dbBrands.findAll();
        let sizes = await dbSizes.findAll();

        res.render('products/list', {products,stock,genres,categories,brands,sizes})

    },

    productDetails: async (req, res) =>{

        let product = await dbProducts.findByPk(req.params.id,{
            include: [
                {model: dbCategories,
                    required: true,
                    attributes: ['name'],
                    where: {is_active: 1}
                },
                {model: dbGenres,
                    required: true,
                    attributes: ['name']
                },
                {model: dbBrands,
                    required: true,
                    attributes: ['name']
                }
            ]
        });

        let stock = await dbStock.findAll({
            attributes: ['available_quantity'],
            include: [
                {model: dbProducts,
                    required: true,
                    attributes: ['name', 'description','img','price'],
                    where: {
                        id: req.params.id
                    }
                },
                {model: dbSizes,
                    required: true,
                    attributes: ['size']
                }
            ]
        });
        
        let loggedUser = req.session.loggedUser
        res.render('products/productDetails', {product,stock,loggedUser})

    },
    
    createProduct: async (req, res) => {

        let categories = await dbCategories.findAll({
            where: {is_active: 1}
        });
        let brands = await dbBrands.findAll({
            where: {is_active: 1}
        });
        let genres = await dbGenres.findAll();
        let sizes = await dbSizes.findAll();

        res.render('products/createProduct', {categories,brands,genres,sizes})

    },

    storeProduct: async (req, res) =>{

        let errors = validationResult(req)

        if(errors.isEmpty()){
            //proceso de multer
            let newImage
            if(req.file == undefined){
                newImage="default-shoes.jpg"
            }else{
                newImage=req.file.filename
            }
            // console.log(JSON.stringify(req.body))

            //revisar lo que proviene del formulario
            let formBody = req.body

            //[idSize,cantDisp]
            let arrSizes = []

            //buscar checked checkbox
            let arrChecked = Object.keys(formBody).filter((key) => key.startsWith('size') && !key.endsWith('quantity'))
            let arrQuantity = Object.entries(formBody).filter(([key,value]) => key.startsWith('size') && key.endsWith('quantity') && value != '')
            let bandError = false

            //validar que se haya hecho selección o completado de la información de tallas
            if(arrChecked.length != 0 && arrQuantity.length != 0){

                arrQuantity.forEach(element => {
                    let idSize = element[0].split('_')[1]
                    let property = 'size_' + idSize
                    //validar que la talla esté checked
                    if(!formBody[property]){
                         bandError = true
                    }
                })
    
                arrChecked.forEach(key => {
                    let idSize = key.split('_')[1]
                    let property = 'size_' + idSize + '_quantity'
                    //validar que la cantidad disponible no esté vacía
                    if(formBody[property] != ''){
                        //armar el array de tallas
                        arrSizes.push([idSize,formBody[property]])
                    }
                    else{
                         bandError = true
                    }
                })
            }
            else{
                bandError = true
            }

            if(!bandError){
                //crear el producto
                dbProducts.create({
                    name: req.body.name,
                    description: req.body.description,
                    price: req.body.price,
                    img: newImage,
                    is_active: 1,
                    brand_id: parseInt(req.body.brand),
                    category_id: parseInt(req.body.category),
                    genre_id: parseInt(req.body.genre)
                })
                //obtener el id del nuevo producto
                .then(function(producto){

                    let idProducto = producto.id
                    // console.log(idProducto)
                    let arrObjSizes = []

                    //armar el array para bulkCreate
                    arrSizes.forEach(element => {
                        let size_id = element[0]
                        let available_quantity = element[1]
                        arrObjSizes.push({'product_id':idProducto,'size_id':size_id,'available_quantity':available_quantity})
                    })

                    dbStock.bulkCreate(arrObjSizes)
                })
                .then(() => res.redirect('./list'))
                .catch(error => console.log(error))
            }
            else{

                let categories = await dbCategories.findAll({
                    where: {is_active: 1}
                });
                let brands = await dbBrands.findAll({
                    where: {is_active: 1}
                });
                let genres = await dbGenres.findAll();
                let sizes = await dbSizes.findAll();

                res.render('products/createProduct', { 
                    errors: errors.mapped(),
                    oldData: formBody,
                    brands: brands,
                    categories: categories,
                    genres: genres,
                    sizes: sizes
                })

            }
  
        }
        //Send validation errors in form to the view
        else {

            let categories = await dbCategories.findAll({
                where: {is_active: 1}
            });
            let brands = await dbBrands.findAll({
                where: {is_active: 1}
            });
            let genres = await dbGenres.findAll();
            let sizes = await dbSizes.findAll();

            res.render('products/createProduct', { 
                errors: errors.mapped(),
                oldData: req.body,
                brands: brands,
                categories: categories,
                genres: genres,
                sizes: sizes
            })
        }
       
    },

    editProduct: async (req, res) => {

        let id = parseInt(req.params.id)

        let product =  await dbProducts.findByPk(id)
        let categories = await dbCategories.findAll({
            where: {is_active: 1}
        });
        let brands = await dbBrands.findAll({
            where: {is_active: 1}
        });
        let genres = await dbGenres.findAll();
        let sizes = await dbSizes.findAll();
        let stock = await dbStock.findAll({
            where: {product_id:id}
        })

        res.render('products/editProduct', {product,categories,brands,genres,sizes,stock})

    },

    update: async (req, res)=>{

        let id = req.params.id
        let errors = validationResult(req)

        if(errors.isEmpty()){

            let product =  dbProducts.findByPk(id)
            
            let newImage;
            //validate if the user change the product image
            if(req.file){
                newImage = req.file.filename;
            } else{
                newImage = product.img;
            }
    
            dbProducts.update
                ({
                    name: req.body.name,
                    description: req.body.description,
                    price: req.body.price,
                    img: newImage,
                    is_active: req.body.status,
                    brand_id: parseInt(req.body.brand),
                    category_id: parseInt(req.body.category),
                    genre_id: parseInt(req.body.genre),
                    modified_date: sequelize.fn('NOW')
                },
                {where: 
                    {id:id}
                })
            
            .then(() => res.redirect('../list'))
            
            .catch(error => console.log(error))   
        }
        //Send validation errors in form to the view
        else {

            let product =  await dbProducts.findByPk(id)
            let categories = await dbCategories.findAll({
                where: {is_active: 1}
            });
            let brands = await dbBrands.findAll({
                where: {is_active: 1}
            });
            let genres = await dbGenres.findAll();
            let sizes = await dbSizes.findAll();
            let stock = await dbStock.findAll({
                where: {product_id:id}
            })

            res.render('products/editProduct', { 
                errors: errors.mapped(),
                oldData: req.body,
                product:product,
                brands: brands,
                categories: categories,
                genres: genres,
                sizes: sizes,
                stock: stock
            })
        }

    },

    //Inactive one product from DB
    destroy : (req, res) => {

        let id = parseInt(req.params.id)

        // dbProducts.destroy({
        //     where: {id:id}
        // })

        dbProducts.update({
            is_active: 0
        },
        {where: 
            {id:id}
        })

        .then(() => res.redirect('../list'))

        .catch(error => console.log(error))
    },

    listInactiveProducts: async (req, res) => {
        let products = await dbProducts.findAll({
            include: [
                {model: dbCategories,
                    required: true,
                    attributes: ['name']
                },
                {model: dbGenres,
                    required: true,
                    attributes: ['name']
                },
                {model: dbBrands,
                    required: true,
                    attributes: ['name']
                }
            ],
        where: {is_active: 0}
        });

        //para los filtros (en un futuro)
        let genres = await dbGenres.findAll();
        let categories = await dbCategories.findAll();
        let brands = await dbBrands.findAll();
        let sizes = await dbSizes.findAll();

        res.render('products/list', {products,genres,categories,brands,sizes})
    }
}


module.exports = productController
