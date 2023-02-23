const spotifyApi = require("../config/spotify.config")
const User = require("../models/user.model")

module.exports.home = (req, res, next) => {
    res.redirect("/login")
}

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
}

module.exports.addArtist = (req, res, next) => {
    if (req.user) {
        const currentArtistIds = req.user.artists.map(x => x.id)
        const currentDate = new Date();
        const timestamp = currentDate.toISOString();

        if (!currentArtistIds.includes(req.body.id)) {
            console.log(req.body)
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
}

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
}