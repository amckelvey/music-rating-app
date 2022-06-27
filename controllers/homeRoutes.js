var SpotifyWebApi = require('spotify-web-api-node');
const router = require('express').Router();
const { User } = require('../models');
const spotifyAuth = require('../utils/spotifyAuth');


// Only allow a get request if the user is logged in
router.get('/', spotifyAuth, async (req, res) => {
  // get decorative new releases data from spotify and render it
  try {
    const spotifyApi = new SpotifyWebApi({
      clientId: req.session.spotifyApi._credentials.clientId,
      clientSecret: req.session.spotifyApi._credentials.clientSecret,
    });
    spotifyApi.setAccessToken(req.session.spotify_token);
    const newReleaseData = await spotifyApi.getNewReleases({ limit :10, country: 'US' });
    const newReleasesArray = newReleaseData.body.albums.items;
    const newReleases = [];
    for (let i = 0; i < newReleasesArray.length; i++) {
      const myObj = {
        albumType: newReleasesArray[i].album_type,
        albumTitle: newReleasesArray[i].name,
        spotifyUrl: newReleasesArray[i].external_urls.spotify,
        artistName: newReleasesArray[i].artists[0].name,
        artistID: newReleasesArray[i].artists[0].id,
        albumArtUrl: newReleasesArray[i].images[0].url,
        releaseDate: newReleasesArray[i].release_date,
        numTracks: newReleasesArray[i].total_tracks
      }
      newReleases.push(myObj);
    }
    const reponseObj = {
      newReleases
    }
    res.render('homepage', reponseObj);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/artist/:artist', async (req, res) => {
  // GET /api/spotify/albums/:artist
  // Receives an artist name input by the user
  // does a GET /v1/search search query to spotify to get the artist_id
  // does a GET /v1/artists/{artist_id}/albums request to get album info  

  // get artist info
  // Receives a spotify artist_id
  // does a GET /v1/artists/{id} request to get artist info

  // Gets the average rating for each album
  // Receives a spotify album id
  // returns the average score of that album
  // req.params.album_id
  try {
    res.render('artist', {});
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/album/:album_id', async (req, res) => {
  // may need to get album info from spotify again
  // v1/albums/{id}

  // get the reviews for the album
  // GET /api/review/:album_id
  // Receives a spotify album id
  // returns an array of objects with review text, their associated ratings, and usernames who wrote them



  try {
    res.render('artist', {});
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get('/login', (req, res) => {
  // if we go to login and we are already logged in we get redirected to home
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

router.get('')

module.exports = router;
