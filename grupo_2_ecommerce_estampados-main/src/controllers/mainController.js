const path = require('path');
const products = require('../database/productDataBase.json')

const mainController = {

    home: (req, res) => {
        res.render('main/home')
    }, 

    termsAndConditions: (req, res) =>{
        res.render('main/termsAndConditions')
    },

    aboutUs: (req, res) =>{
        res.render('main/aboutUs')
    }
}

module.exports = mainController
