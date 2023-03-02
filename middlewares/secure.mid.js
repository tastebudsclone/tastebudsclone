const Post = require("../models/post.model");
const createError = require('http-errors');

module.exports.isAuthenticated = (req, res, next) => {
    if(req.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

module.exports.isOwnedByUser = (req, res, next) => {
    if (req.params.username === req.user.username) {
        next();
    } else {
        next(createError(403, 'Forbidden'))
    }
};

module.exports.canEditHome = (req, res, next) => {
    Post.findById(req.params.id)
        .populate('user')
        .then((post) => {
            console.log(req.params.id)
            console.log(post.user.username, req.user.username)
            if (post.user.username === req.user.username) {
                next();
            } else {
                next(createError(403, 'Forbidden'))
            }
        })
        .catch(next);
};