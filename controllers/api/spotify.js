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

// GET /api/spotify/albums/:artist
// Receives an artist name input by the user
// does a GET /v1/search search query to spotify to get the artist_id
// does a GET /v1/artists/{artist_id}/albums request to get album info
// Returns an array of album info

router.get('/albums/:artist', async (req, res) => {
  try {
    const spotifyApi = await spotifyAuthorize();
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
router.get('/artist/:artist', async (req, res) => {
  try {
    const spotifyApi = await spotifyAuthorize();
    const searchArtistData = await spotifyApi.searchArtists(req.params.artist, {limit: 1});
    const artistId = searchArtistData.body.artists.items[0].id;
    console.log(artistId);
    const artistData = await spotifyApi.getArtist(artistId);

    res.status(200).json(artistData.body);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});



module.exports = router;

