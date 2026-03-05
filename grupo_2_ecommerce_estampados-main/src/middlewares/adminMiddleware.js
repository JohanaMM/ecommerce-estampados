function adminMiddleware(req, res, next){
    if (req.session.loggedUser != undefined && req.session.loggedUser.role_id == 1){
        next();
    }else{
        res.send("No tienes permisos para ver esto");
    }
}

module.exports = adminMiddleware;