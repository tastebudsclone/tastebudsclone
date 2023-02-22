const spotifyApi = require("../config/spotify.config")
const User = require("../models/user.model")

module.exports.artist = (req, res, next) => {
    req.user.artist?.split(',').forEach(artist => {
        spotifyApi
            .searchArtists(artist)
            .then(data => {
            console.log(artist)
            console.log(data.body.artists.items[0].id)
        })
        .catch(next)
    })
    next();
}