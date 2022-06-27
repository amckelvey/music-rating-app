var SpotifyWebApi = require('spotify-web-api-node');
const router = require('express').Router();
const { User, Rating } = require('../models');
const spotifyAuth = require('../utils/spotifyAuth');


// Only allow a get request if the user is logged in
router.get('/', spotifyAuth, async (req, res) => {
  console.log("In the home route");
  // get decorative new releases data from spotify and render it
  try {
    const spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET
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


// Receives an artist id
router.get('/artist/:artist_id', spotifyAuth, async (req, res) => {
  console.log("In the artist route");
  try {
    const spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET
    });
     // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(req.session.spotify_token);
    const artistId = req.params.artist_id;
    // does a GET /v1/artists/{artist_id}/albums request to get album info  
    const albumData = await spotifyApi.getArtistAlbums(artistId ,{include_groups: 'album', market: 'US', limit:'50'});
    // also gives artist ID back
    const albumArray = albumData.body.items;
    const artistAlbums = [];
    for (let i = 0; i < albumArray.length; i++) {
      // Gets the average rating for each album
      const scoreData = await Rating.findAll({
        attributes: ['score'],
        where: {
          // Receives a spotify album id
          album_id: albumArray[i].id
        }
      });
      let scores = scoreData.map((score) => score.score);
      if (scoreData.length > 0) {
        let total = 0;
        for(let i = 0; i < scores.length; i++) {
          total += scores[i];
        }
        const rawAvg = total / scores.length;
        // returns the average score of that album
        const average = Math.round(rawAvg * 10) / 10;
      } else {
        var average = null;
      }
      const myObj = {
        albumID: albumArray[i].id,
        albumTitle: albumArray[i].name,
        artistID: albumArray[i].artists[0].id,
        albumArtUrl: albumArray[i].images[0].url,
        releaseDate: albumArray[i].release_date,
        averageRating: average,
        // also return number of votes
        numRatings: scores.length
      }
      artistAlbums.push(myObj);
    }

    // get artist info
    // Receives a spotify artist_id
    // does a GET /v1/artists/{id} request to get artist info
    const artistData = await spotifyApi.getArtist(artistId);
    spotifyApi.setAccessToken(req.session.spotify_token);
    const artistID = req.params.artist_id;
    const spotifyData = await spotifyApi.getArtistRelatedArtists(artistID);
    let relatedData = spotifyData.body.artists;
    relatedData = relatedData.slice(0, 5);
    const relatedArtists = [];
    for (let i = 0; i < relatedData.length; i++) {
      const myObj = {
        artistId: relatedData[i].id,
        name: relatedData[i].name
      }
      relatedArtists.push(myObj);
    }
    const artistInfo = {
      spotifyUrl: artistData.body.external_urls.spotify,
      genres: artistData.body.genres,
      name: artistData.body.name,
      artistImageUrl: artistData.body.images[0].url,
      relatedArtists: relatedArtists
    }

    const responseObj = {
      artistAlbums: artistAlbums,
      artistData: artistInfo
    }
    // ===========================================================
    // NOTE!!!!! CHANGE TO RES.RENDER WHEN TESTING WITH HANDLEBARS
    // ===========================================================
    res.status(200).json(responseObj);
    // res.render('artistPage', responseObj);
  } catch (err) {
    console.log(err);
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

module.exports = router;
