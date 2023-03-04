const spotifyApi = require("../config/spotify.config");
const User = require("../models/user.model");
const LikedUser = require("../models/likedUser.model");

module.exports.home = (req, res, next) => {
    res.redirect("/login")
};

module.exports.search = (req, res, next) => {
    if (req.query.name) {
        spotifyApi
        .searchArtists(req.query.name)
        .then(data => {
        res.render("search", {user: req.user, artists: data.body.artists.items})
        })
        .catch(next);
     } else {
        res.render("search")
     }
};

module.exports.addArtist = (req, res, next) => {
    if (req.user) {
        const currentArtistIds = req.user.artists.map(x => x.id)
        const currentDate = new Date();
        const timestamp = currentDate.toISOString();

        if (!currentArtistIds.includes(req.body.id)) {
            req.user.artists.push({id: req.body.id, name: req.body.name, genres: req.body.genres.split(","), timestamp: timestamp})
        } else {
            req.user.artists = req.user.artists.filter(x => x.id !== req.body.id)
        }
        req.user.save()
            .then((() => {
                if (req.params.id) {
                    res.redirect(`/artist/${req.body.id}`)
                } else {
                    res.redirect(`/search?name=${req.body.name}`)
                }
            }))
            .catch(next)
    }
};

module.exports.artist = (req, res, next) => {
    spotifyApi
        .getArtist(req.params.id)
        .then(artist => {
            spotifyApi
                .getArtistTopTracks(req.params.id, 'ES')
                .then(topTracks => {
                    spotifyApi
                        .getArtistAlbums(artist.body.id)
                        .then(albums => {
                            res.render('artist', {artist: artist.body, albums: albums.body.items, tracks: [topTracks.body.tracks[0], topTracks.body.tracks[1], topTracks.body.tracks[3]]})
                        })
                        .catch(next)
                })
                .catch(next)
        })
        .catch(next)
};

module.exports.match = (req, res, next) => {
    const bands = req.user.artists.map(x => x.name)
    User.find( {"artists.name": { $in: bands }} )
        .then(users => {
            currentUser = res.locals.currentUser;
            LikedUser.find({ from: req.user.id })
                .then(likes => {
                    res.render("common/match", { users, currentUser, likes})
                })
                .catch(next)
        })
        .catch(next)
};

module.exports.userLiked = (req, res, next) => {
    req.body.from = req.user.id
    User.findById(req.params.id)
        .then(user => {
            req.body.to = user.id;
            LikedUser.create(req.body)
                .then(() => {
                    if (req.query.path === 'match') {
                        res.redirect("/match")
                    } else {
                        res.redirect("/usersList")
                    }
                })
                .catch(next)
        })
        .catch(next)
};

module.exports.userDisliked = (req, res, next) => {
    LikedUser.findOneAndDelete( {$and: [{ to: req.params.id }, { from: req.user.id }]} )
        .then(() => {
            if (req.query.path === 'match') {
                res.redirect("/match")
            } else {
                res.redirect("/usersList")
            }
        })
        .catch(next)
};

module.exports.list = (req, res, next) => {
    User.find()
        .then((users) => {
            LikedUser.find({ from: req.user.id })
            .then(likes => {
                currentUser = res.locals.currentUser
                res.render("common/list", { users, likes, currentUser })
            })
            .catch(next)
        })
        .catch(next);
};