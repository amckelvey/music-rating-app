var SpotifyWebApi = require('spotify-web-api-node');
const router = require('express').Router();
const spotifyAuth = require('../../utils/spotifyAuth');

// // test route to test SpotifyAuth
// router.get('/expires/', spotifyAuth, async (req, res) => {
//   try {
//     console.log(req.session.spotifyApi);
//     res.status(200).json();

//   } catch (err) {
//     console.log(err);
//     res.status(500).json(err);
//   }
// });

// GET /api/spotify/albums/:artist
// Receives an artist name input by the user
// does a GET /v1/search search query to spotify to get the artist_id
// does a GET /v1/artists/{artist_id}/albums request to get album info
// Returns an array of album info
router.get('/albums/:artist', spotifyAuth, async (req, res) => {
  try {
    const spotifyApi = new SpotifyWebApi({
      clientId: req.session.spotifyApi._credentials.clientId,
      clientSecret: req.session.spotifyApi._credentials.clientSecret,
    });
    spotifyApi.setAccessToken(req.session.spotifyApi._credentials.accessToken);
    const searchArtistData = await spotifyApi.searchArtists(req.params.artist, {limit: 1});
    const artistId = searchArtistData.body.artists.items[0].id;
    const albumData = await spotifyApi.getArtistAlbums(artistId ,{include_groups: 'album', market: 'US'});
    const albumArray = albumData.body.items;
    res.status(200).json(albumArray);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET /api/spotify/artist/:artist
// Receives an artist name input by the user
// does a GET /v1/search search query to spotify to get the artist_id
// does a GET /v1/artists/{id} request to get album info
router.get('/artist/:artist', spotifyAuth, async (req, res) => {
  try {
    const spotifyApi = new SpotifyWebApi({
      clientId: req.session.spotifyApi._credentials.clientId,
      clientSecret: req.session.spotifyApi._credentials.clientSecret,
    });
    spotifyApi.setAccessToken(req.session.spotifyApi._credentials.accessToken);
    const searchArtistData = await spotifyApi.searchArtists(req.params.artist, {limit: 1});
    const artistId = searchArtistData.body.artists.items[0].id;
    const artistData = await spotifyApi.getArtist(artistId);

    res.status(200).json(artistData.body);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET /api/spotify/related/:artist_id
// Receives an artist id input by the user
// does a GET /v1/artists/{id}/related-artists to get related artist info
router.get('/related/:artist_id', spotifyAuth, async (req, res) => {
  try {
    const spotifyApi = new SpotifyWebApi({
      clientId: req.session.spotifyApi._credentials.clientId,
      clientSecret: req.session.spotifyApi._credentials.clientSecret,
    });
    spotifyApi.setAccessToken(req.session.spotifyApi._credentials.accessToken);
    const artistData = await spotifyApi.getArtistRelatedArtists(req.params.artist_id);

    res.status(200).json(artistData.body);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});



module.exports = router;

