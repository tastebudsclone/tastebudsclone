const User = require("../models/user.model");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Comment = require("../models/comment.model");
const Post = require("../models/post.model");
const createError = require("http-errors");
const LikedUser = require("../models/likedUser.model");

const session = {};

module.exports.login = (req, res) => {
  res.render("common/login");
};

module.exports.doLogin = (req, res, next) => {
  function renderWithErrors(errors) {
    res.render("common/login", { errors, user: req.body });
  }

  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        renderWithErrors({ email: "Email not found" });
      } else {
        bcrypt
          .compare(req.body.password, user.password)
          .then((ok) => {
            if (ok) {
              req.session.userId = user.id;
              res.redirect("/home");
            } else {
              renderWithErrors({
                password: "Password is required / Incorrect password",
              });
            }
          })
          .catch(next);
      }
    })
    .catch(next);
};

module.exports.create = (req, res) => {
  res.render("common/signup");
};

module.exports.doCreate = (req, res, next) => {
  function renderWithErrors(errors) {
    res.render("common/signup", { errors, user: req.body });
  }

  User.findOne({
    $or: [{ email: req.body.email }, { username: req.body.username }],
  })
    .then((user) => {
      if (
        user?.username === req.body.username &&
        user?.email === req.body.email
      ) {
        renderWithErrors({
          username: "Username already in use",
          email: "Email already in use",
        });
      } else if (user?.username === req.body.username) {
        renderWithErrors({ username: "Username already in use" });
      } else if (user?.email === req.body.email) {
        renderWithErrors({ email: "Email already in use" });
      } else {
        return User.create(req.body).then(() => res.redirect("/login"));
      }
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        renderWithErrors(error.errors);
      } else {
        next(error);
      }
    });
};

module.exports.home = (req, res, next) => {
  const criteria = {};

  Post.find(criteria)
    .populate("user")
    .sort({ createdAt: req.query.sort || "desc" })
    .then((posts) => {
      res.render("common/home", {
        posts,
        currentUser: req.user,
        query: req.query,
      });
    })
    .catch(next);
};

module.exports.createPost = (req, res, next) => {
  function renderWithErrors(errors) {
    res.render("common/home", { errors, post: req.body });
  }
  if (req.file) {
    req.body.image = req.file.path;
  }

  if (req.body.song) {
    req.body.song = req.body.song.split('=')[1];
  }

  req.body.user = req.user.id;
  console.log(req.body.song)

  Post.create(req.body)
    .then(() => res.redirect("/home"))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        renderWithErrors(error.errors);
      } else {
        next(error);
      }
    });
};

module.exports.doEditPost = (req, res, next) => {
  Post.findByIdAndUpdate(req.params.id, req.body, { runValidators: true })
    .then((post) => {
      res.redirect("/home");
    })
    .catch((error) => {
      next(error);
    });
};

module.exports.deletePost = (req, res, next) => {
  Post.findByIdAndDelete(req.params.id)
    .then((post) => {
      if (!post) {
        res.redirect("/home");
      } else if (post.user.username == req.user.username) {
        post
          .delete()
          .then(() => res.redirect("/home"))
          .catch(next);
      } else {
        res.redirect("/home");
      }
    })
    .catch(next);
};

module.exports.editPost = (req, res, next) => {
  Post.findById(req.params.id)
    .populate("user")
    .then((post) => {
      res.render("common/edit", { post });
    })
    .catch(next);
};

module.exports.profile = (req, res, next) => {
 

  User.findOne({ username: req.params.username })
    .then((user) => {
        if (!user) {
            return next(createError(404, 'Page not found'))
        }
      Comment.find({ user: user })
        .populate("user")
        .populate("creator")
        .sort({ createdAt: "desc" })
        .then((comments) => {
          Post.find({ user: user })
            .populate("user")
            .sort({ createdAt: "desc" })
            .then((posts) => {
              const tastes = Object.keys(
                user.artists
                  .map(x => x.genres)
                  .reduce((acc, cur) => {
                    cur.forEach(musicGenre => acc[musicGenre] = true)
                    return acc
                  }, {})
              )
              
              res.render("users/profile/home", {
                user,
                posts,
                photos: user.photos.filter(x => x !== user.photos[0]), 
                comments,
                tastes: tastes,
                currentSection: req.query.section,
                songsArray: [...user.songs].sort((a, b) => {return b.timestamp - a.timestamp}),
                postsAndArtists: [...posts, ...user.artists].sort((a, b) => {
                    const aDate = a.timestamp || a.createdAt
                    const bDate = b.timestamp || b.createdAt

                    return bDate.getTime() - aDate.getTime()
                })
              });
            })
            .catch(next);
        })
        .catch(next);
    })
    .catch(next);
};

module.exports.logout = (req, res, next) => {
  if (req.session) {
    req.session.destroy((error) => {
      if (error) {
        //ERROR IS NEEDED(TO DO)
      } else {
        console.log("Logged out");
        res.redirect("/login");
      }
    });
  }
};
module.exports.edit = (req, res, next) => {
  const { section } = req.query;
  console.log(req.body)
  User.findByIdAndUpdate(req.user.id, req.body, { runValidators: true })
    .then((user) => {
      res.redirect(`/users/${req.params.username}?section=${section}`);
    })
    .catch((error) => {
      next(error);
    });
};

module.exports.addSong = (req, res, next) => {
  const currentDate = new Date();
  const timestamp = currentDate.toISOString();
  req.user.songs.push({path: req.body.song.split('=')[1], timestamp: timestamp})
  req.user.save()
    .then(() => {
      res.redirect(`/users/${req.user.username}?section=songs`);
    })
    .catch(next)
}

module.exports.createComment = (req, res, next) => {
    req.body.creator = req.user.id;
    User.findOne({ username: req.params.username })
      .then((user) => {
        req.body.user = user;
        Comment.create(req.body)
          .then(() => res.redirect(`/users/${user.username}?section=about`))
          .catch((error) => {
            next(error);
          });
      })
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          res.render("/users/:username?section=about", {
            errors: error.errors,
            comment: req.body,
          });
        } else {
          next(error);
        }
      });
  };

module.exports.editProfile = (req, res, next) => {
  User.findOne({ username: req.params.username })
    .then(user => {
      res.render("users/profile/settings", { user })
    })
    .catch(error => {
      next(error);
    })
  };

module.exports.doEditProfile = (req, res, next) => {
  if (req.files.avatar) {
    req.user.avatar = req.files.avatar[0].path;
  }
  /* ADDING EVERY FILE IN THE PHOTOS ARRAY (?) */

  if (req.files.photos) {
    req.user.photos.push(...req.files.photos.map(x => x.path))
  }

  Object.assign(req.user, req.body)
  
  req.user.save()
    .then(user => {
      console.log(req.user.username)
      res.redirect(`/users/${user.username}/settings`)
    })
    .catch(error => {
      next(error);
    })
};

module.exports.likes = (req, res, next) => {
  
  LikedUser.find({ from: req.user.id })
    .populate("to")
    .then((likes) => {
      res.render("users/profile/likes", { likes })
    })
    .catch(next);
};