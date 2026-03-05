const path = require('path');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require("express-validator");

const Sequelize = require('sequelize');
const db = require("../database/models/index.js");
const Op = Sequelize.Op
const dbUsers = db.User
const dbRole = db.Role

const adminController = {

    admin: (req, res) =>{
        res.render('admin/admin')
    },

    createAdminUser: (req, res) => {

        dbRole.findAll()
        .then(function(roles){
            res.render('admin/createUser',{roles})
        })        
    },

    store: (req, res) => {

        //image setup
        let newImage
        if (req.file == undefined) {
            newImage = "user.png"
        } else {
            newImage = req.file.filename
        }

        let encryptedPassword = bcrypt.hashSync(req.body.password, 10);

        dbUsers.create({
            first_name: req.body.name,
            last_name: req.body.lastName,
            email: req.body.email,
            password: encryptedPassword,
            avatar_img: newImage,
            role_id: req.body.role,
            is_active: 1
        })
        .then(() => res.redirect('/admin/userList'))

    },
    
    list: (req, res) => {

        dbUsers.findAll().then(function(Users){
            res.render('admin/userList', { Users })
        })
        
    },

    edit: (req,res) => {

        let roles = dbRole.findAll()
        let User = dbUsers.findByPk(req.params.id)

        Promise.all([roles,User])
        
        .then(function([roles,User]){
            res.render('admin/editUser', {roles,User})

        })
    },

    update: (req, res) => {

        let newImage;
        if(req.file){
            newImage = req.file.filename;
        } 
        
        dbUsers.update({
            first_name: req.body.name,
            last_name: req.body.lastName,
            email: req.body.email,
            avatar_img: newImage,
            role_id: req.body.role,
            is_active: 1,
            modified_date: Sequelize.fn('NOW')
        }, {
            where: {
                id: req.params.id
            }
        }).then(function(user){
            if(!req.file){
                newImage = user.img;
            }
            res.redirect("../userList")
        })
    },

    destroy: (req, res) => {
        dbUsers.destroy({
            where: {
                id: req.params.id
            }
        }).then(function(){
            res.redirect("../userList")
        })
    }

}
module.exports = adminController

