const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require("express-validator");

const Sequelize = require('sequelize');
const db = require("../database/models/index.js");
const Op = Sequelize.Op
const dbUsers = db.User
const dbRole = db.Role

const userController = {

    login: (req, res) => {
        res.render('users/login')
    },
    
    loginProcess: async (req, res) => {

        let errors = validationResult(req)

        if(errors.isEmpty()){
            //1. finding the existing user
            let loggedUser = await dbUsers.findOne({
                where: {
                    email: { [Op.like]: `%${req.body.email}%` },
                    is_active: 1
                }
            })

            //2. compare passwords from the existing user. If the password is fine, let me in. If it isn't, show me the errors.
            if(loggedUser){
                let passwordVerification = bcrypt.compareSync(req.body.password, loggedUser.password)
                
                if (passwordVerification){
                    //session action and cookie action (for remembering the account and storing it into a cookie.)
                    delete loggedUser.dataValues.password;
                    req.session.loggedUser = loggedUser;
                    if (req.body.remindMe != undefined) {
                        res.cookie("remindMe", loggedUser.email,{
                            maxAge: 30000000
                        })
                    }
                    res.redirect("./profile")
                }
                //Send validation of user in db to the view
                else{
                    errors['msg'] = 'Correo electrónico y/o contraseña incorrectos'
                    res.render('users/login',  {
                        errors: errors,
                        oldData: req.body
                    })
                }
            }
            //Send validation of user in db to the view
            else{
                errors['msg'] = 'Correo electrónico y/o contraseña incorrectos'
                res.render('users/login',  {
                    errors: errors,
                    oldData: req.body
                })
            }
        }
        //Send validation errors in form to the view
        else {
            res.render('users/login', { 
                errors: errors.mapped(),
                oldData: req.body
            })
        }

    },

    register: (req, res) => {
        res.render('users/register')
    },

    create: async (req, res) => {

        let errors = validationResult(req)

        if(errors.isEmpty()){

             //validate if the user email already exists
             let registerUser = await dbUsers.findOne({
                where: {
                    email: { [Op.like]: `%${req.body.email}%` }
                }
            })

            //if the email doesnt exists, then register the user
            if(!registerUser){

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
                    role_id: 2,
                    is_active: 1
                })
        
                res.redirect('/users/login')    
            
            }
            //Send validation of user in db to the view
            else{
                errors.errors[0] = {
                    value: req.body.email,
                    msg: 'El correo ingresado ya existe',
                    param: 'email',
                    location: 'body'
                  }

                res.render('users/register',  {
                    errors: errors.mapped(),
                    oldData: req.body
                })
            }

        }
        //Send validation errors in form to the view
        else {
            res.render('users/register', { 
                errors: errors.mapped(),
                oldData: req.body
            })
        }

    },

    profile: (req, res) => {
        dbUsers.findByPk(req.session.loggedUser.id).then(function(User){
            res.render('users/profile', { User })
        })

    },

    //edición de usuario desde el profile
    edit: async (req,res) => {

        let loggedUser = req.session.loggedUser
        let User = await dbUsers.findByPk(loggedUser.id)

        res.render('users/edit', {User})

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
            res.redirect("../profile")
        })
    },

    //Inactive a user from DB
    deleteAccount : async (req, res) => {

        let id = parseInt(req.params.id)

        await dbUsers.update({
            is_active: 0
        },
        {where: 
            {id:id}
        })

        userController.logout(req,res)

    },

    logout: (req, res) => {
        res.clearCookie('remindMe');
        req.session.destroy();
        return res.redirect('/');
    }

}
module.exports = userController

