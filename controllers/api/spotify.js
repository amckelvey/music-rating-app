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
// Returns an array of album info, also returns artist_id
router.get('/albums/:artist', spotifyAuth, async (req, res) => {
  try {
    const spotifyApi = new SpotifyWebApi({
      clientId: req.session.spotifyApi._credentials.clientId,
      clientSecret: req.session.spotifyApi._credentials.clientSecret,
    });
     // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(req.session.spotify_token);
    // hard coded to pick most popular result
    const searchArtistData = await spotifyApi.searchArtists(req.params.artist, {limit: 1});
    const artistId = searchArtistData.body.artists.items[0].id;
    const albumData = await spotifyApi.getArtistAlbums(artistId ,{include_groups: 'album', market: 'US'});
    // also gives artist ID back
    const albumArray = albumData.body.items;
    const myArray = [];
    for (let i = 0; i < albumArray.length; i++) {
      const myObj = {
        albumTitle: albumArray[i].name,
        spotifyUrl: albumArray[i].external_urls.spotify,
        artistName: albumArray[i].artists[0].name,
        artistID: albumArray[i].artists[0].id,
        albumArtUrl: albumArray[i].images[0].url,
        releaseDate: albumArray[i].release_date,
        numTracks: albumArray[i].total_tracks
      }
      myArray.push(myObj);
    }
    res.status(200).json(myArray);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET /api/spotify/artist/:artist_id
// Receives a spotify artist_id
// does a GET /v1/artists/{id} request to get artist info
router.get('/artist/:artist_id', spotifyAuth, async (req, res) => {
  try {
    const spotifyApi = new SpotifyWebApi({
      clientId: req.session.spotifyApi._credentials.clientId,
      clientSecret: req.session.spotifyApi._credentials.clientSecret,
    });
    spotifyApi.setAccessToken(req.session.spotify_token);
    const artistID = req.params.artist_id;
    const artistData = await spotifyApi.getArtist(artistID);

    const myObj = {
      spotifyUrl: artistData.body.external_urls.spotify,
      genres: artistData.body.genres,
      name: artistData.body.name,
      artistImageUrl: artistData.body.images[0].url,
    }

    res.status(200).json(myObj);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// get new releases for the home page
// GET /api/spotify/new-releases/
// does a GET v1/browse/new-releases requestion to spotify to get new releases
router.get('/new-releases/', spotifyAuth, async (req, res) => {
  try {
    const spotifyApi = new SpotifyWebApi({
      clientId: req.session.spotifyApi._credentials.clientId,
      clientSecret: req.session.spotifyApi._credentials.clientSecret,
    });
    spotifyApi.setAccessToken(req.session.spotify_token);
    const newReleaseData = await spotifyApi.getNewReleases({ limit :10, country: 'US' });

    res.status(200).json(newReleaseData.body);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});



// get album tracks
// GET /api/spotify/album-tracks/:album_id
// Receives a spotify album_id
// does a GET v1/albums/{id}/tracks request to get an albums track info
router.get('/album-tracks/:album_id', spotifyAuth, async (req, res) => {
  try {
    const spotifyApi = new SpotifyWebApi({
      clientId: req.session.spotifyApi._credentials.clientId,
      clientSecret: req.session.spotifyApi._credentials.clientSecret,
    });
    spotifyApi.setAccessToken(req.session.spotify_token);
    const albumID = req.params.album_id;
    const trackData = await spotifyApi.getAlbumTracks(albumID);
    const trackArray = trackData.body.items;
    
    res.status(200).json(trackArray);
    
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;

