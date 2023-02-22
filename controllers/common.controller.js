const spotifyApi = require("../config/spotify.config")

module.exports.home = (req, res, next) => {
    res.redirect("/login")
}

module.exports.search = (req, res, next) => {
    if (req.query.name) {
        spotifyApi
        .searchArtists(req.query.name)
        .then(data => {
        console.log(data)
        console.log(data.body.artists.items[0].id)
        res.render("search", {artists: data.body.artists.items})
        })
        .catch(next);
     } else {
        res.render("search")
     }
   
}

module.exports.artist = (req, res, next) => {
    spotifyApi
        .getArtist(req.params.id)
        .then(artist => {
            spotifyApi.getArtistAlbums(artist.body.id)
                .then(albums => {
                    res.render('artist', {artist: artist.body, albums: albums.body.items})
                })
                .catch(next)
        })
        .catch(next)
}