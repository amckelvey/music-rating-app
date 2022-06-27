var SpotifyWebApi = require('spotify-web-api-node');
const router = require('express').Router();


// will likely need to move this
async function spotifyAuthorize() {
  var clientId = 'b8613864536c4491b058d23befbec540',
  clientSecret = 'fadd7cafd3d840d7b4d14180fc84ebb4';
  spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
  });

  let data;
  try {
    data = await spotifyApi.clientCredentialsGrant();
    console.log('The access token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);
  } catch (err) {
    console.log('Something went wrong when retrieving an access token', err);
  }
  // how do a return the spotify object?
  return spotifyApi;
}

// GET /api/spotify/:artist
// Receives an artist name input by the user
// does a GET /v1/search search query to spotify to get the artist_id
// does a GET /v1/artists/{artist_id}/albums request to get album info
// Returns the relevant album info

router.get('/:artist', async (req, res) => {
  try {
    const spotifyApi = await spotifyAuthorize();
  
    const searchArtistData = await spotifyApi.searchArtists(req.params.artist, {limit: 1});
  
    const artistId = searchArtistData.body.artists.items[0].id;

    const albumData = await spotifyApi.getArtistAlbums(artistId ,{include_groups: 'album', market: 'US'});

    const albumArray = albumData.body.items;


    res.status(200).json(albumArray);

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
     // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(req.session.spotify_token);
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
    spotifyApi.setAccessToken(req.session.spotify_token);
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
    spotifyApi.setAccessToken(req.session.spotify_token);
    const artistData = await spotifyApi.getArtistRelatedArtists(req.params.artist_id);

    res.status(200).json(artistData.body);

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;

