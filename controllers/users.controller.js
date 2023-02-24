const User = require("../models/user.model");
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Comment = require("../models/comment.model");

const session = {};

module.exports.login = (req, res) => {
    res.render('users/login');
};

module.exports.doLogin = (req, res, next) => {

    function renderWithErrors(errors) {
        res.render('users/login', { errors, user: req.body })
    }

    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                renderWithErrors({ email: 'Email not found' })
            } else {
                bcrypt
                    .compare(req.body.password, user.password)
                    .then((ok) => {
                        if(ok) {
                            req.session.userId = user.id;
                            res.redirect('/home');
                        } else {
                            renderWithErrors({ password: 'Password is required / Incorrect password'});
                        }
                    })
                    .catch(next);
            }
        })
        .catch(next);
};

module.exports.create = (req, res) => {
    res.render('users/signup');
};

module.exports.doCreate = (req, res, next) => {

    function renderWithErrors(errors) {
        res.render('users/signup', { errors, user: req.body })
    }

    User.findOne({ $or: [{email: req.body.email}, {username: req.body.username}] })
        .then(user => {
            if (user?.username === req.body.username && user?.email === req.body.email) {
                renderWithErrors({ username: 'Username already in use', email: 'Email already in use'})
            } else if (user?.username === req.body.username) {
               renderWithErrors({ username: 'Username already in use' })
            } else if (user?.email === req.body.email) {
               renderWithErrors({ email: 'Email already in use'})
            } else {
                return User.create(req.body)
                    .then(() => res.redirect('/login'))
            }
        })
        .catch((error) => {
            if (error instanceof mongoose.Error.ValidationError) {
                renderWithErrors(error.errors)
            } else {
                next(error);
            }
        })
};

module.exports.home = (req, res, next) => {
    console.log(res.locals.currentUser);
    res.render("users/home");
}

module.exports.profile = (req, res, next) => {
    User.findOne({ username: req.params.username })
        .then(user => {
            currentUser = req.user;
            let canEdit = false
            if (currentUser.username === user?.username) {
                canEdit = true;
            }
            Comment.find({ user: user})
                .populate('user')
                .populate('creator')
                .then((comments) => {
                    console.log(comments);
                    res.render("users/profile/home",{ user, comments, canEdit, currentUser, currentSection: req.query.section});
                })
                .catch(next);
            console.log(canEdit)
            
        })
        .catch(next)
}

module.exports.logout = (req, res, next) => {
    if (req.session) {
        req.session.destroy((error) => {
            if (error) {
            //ERROR IS NEEDED(TO DO)
            } else {
                console.log('Logged out');
                res.redirect("/login");
            }
        });
    }
}
module.exports.edit = (req, res, next) => {
    const { section } = req.query;
    User.findByIdAndUpdate(req.user.id, req.body, { runValidators: true })
        .then((user) => {
            res.redirect(`/users/${req.params.username}?section=${section}`)
        })
        .catch((error) => {
            next(error);
        })
}

module.exports.createComment = (req, res, next) => {
    if (req.body.message) {
        req.body.creator =  req.user.id;
        User.findOne({ username: req.params.username })
        .then(user => {
            req.body.user = user;
            Comment.create(req.body)
                .then(() => next())
                .catch((error) => {
                next(error);
            })
        })
        .catch(error => {
            next(error);
        })
    } else {
        next()
    }
}
