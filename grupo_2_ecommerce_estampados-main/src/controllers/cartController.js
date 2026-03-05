const path = require('path');
const products = require('../database/productDataBase.json')
const db = require("../database/models/index.js")

const dbCarts = db.Cart;
const dbOrderstatus = db.Orderstatus
const dbOrders = db.Order

const mainController = {

    cart: (req, res) => {
        res.render('cart/cart', {products})
    },
    list: (req, res) => {
        dbOrderstatus.findAll().then(function(data){
            res.json(data)
        })
    }

}

module.exports = mainController
