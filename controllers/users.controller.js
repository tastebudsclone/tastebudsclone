const User = require("../models/user.model");
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
    console.log(req.params)
    User.findOne({ username: req.params.id })
        .then(user => {
            res.render("users/profile/home",{ user, currentSection: req.query.section});
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
    console.log(req.path)
    res.render("users/profile/edit", { currentSection: req.query.section, currentPath: req.path})
}

module.exports.doEdit = (req, res, next) => {
    User.findByIdAndUpdate(res.locals.currentUser, req.body)
        .then((user) => {
            res.redirect(`/users/${res.locals.currentUser.username}?section=about`)
        })
        .catch((error) => {
            next(error);
        })
}