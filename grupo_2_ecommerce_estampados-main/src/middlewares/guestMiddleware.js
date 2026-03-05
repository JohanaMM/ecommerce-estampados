function guestMiddleware(req, res, next){
    if (req.session.loggedUser == undefined){
        next();
    }else{
        res.redirect("/");
    }
}

module.exports = guestMiddleware;