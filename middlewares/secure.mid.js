module.exports.isAuthenticated = (req, res, next) => {
    if(req.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

module.exports.isOwnedByUser = (req, res, next) => {
    console.log(req.params.username, req.user.username)
    if (req.params.username === req.user.username) {
        next();
    } else {
        //TODO ERROR
        res.redirect('/home')
    }
}