var SpotifyWebApi = require('spotify-web-api-node');
const router = require('express').Router();
const { User, Rating } = require('../models');
const spotifyAuth = require('../utils/spotifyAuth');
const { Op } = require("sequelize");

// GET http://localhost:3001/
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
        albumArtBig: newReleasesArray[i].images[0].url,
        albumArtMedium: newReleasesArray[i].images[1].url,
        albumArtSmall: newReleasesArray[i].images[2].url,
        releaseDate: newReleasesArray[i].release_date,
        numTracks: newReleasesArray[i].total_tracks
      }
      newReleases.push(myObj);
    }
    const reponseObj = {
      newReleases,
      loggedIn: req.session.loggedIn ? true : false
    }
    res.render('homepage', reponseObj);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// first do GET http://localhost:3001/api/spotify/search/artist_name to get the artist ID
// http://localhost:3001/artist/artist_id
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
      const albumID = albumArray[i].id;
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

      let userScore = null;
      if (req.session.loggedIn) {
        
        const userID = req.session.userID;
        const ratingData = await Rating.findOne({
          attributes: ['score'],
          where: {
            album_id: albumID,
            user_id: userID
          }
        });
        userScore = ratingData.get({ plain: true });
      }

      const myObj = {
        albumID: albumID,
        albumTitle: albumArray[i].name,
        artistID: albumArray[i].artists[0].id,
        albumArtBig: albumArray[i].images[0].url,
        albumArtMedium: albumArray[i].images[1].url,
        albumArtSmall: albumArray[i].images[2].url,
        releaseDate: albumArray[i].release_date,
        averageRating: average,
        // also return number of votes
        numRatings: scores.length,
        userScore: userScore
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
      artistImageBig: artistData.body.images[0].url,
      artistImageMedium: artistData.body.images[1].url,
      relatedArtists: relatedArtists
    }

    const responseObj = {
      artistAlbums: artistAlbums,
      artistData: artistInfo,
      loggedIn: req.session.loggedIn ? true : false
    }
    // ===========================================================
    // NOTE!!!!! CHANGE TO RES.RENDER WHEN TESTING WITH HANDLEBARS
    // ===========================================================
    // res.status(200).json(responseObj);
    res.render('artistPage', responseObj);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// http://localhost:3001/album/album_id
router.get('/album/:album_id', spotifyAuth, async (req, res) => {
  try {
    const spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });
    spotifyApi.setAccessToken(req.session.spotify_token);

    // may need to get album info from spotify again
    // v1/albums/{id}
    const albumId = req.params.album_id;
    const albumData = await spotifyApi.getAlbum(albumId, { market: 'US' });
    const trackData = await spotifyApi.getAlbumTracks(albumId);
    const trackArray = trackData.body.items;
    const myArray = [];
    for (let i = 0; i < trackArray.length; i++) {
      const myObj = {
        length: millisToMinutesAndSeconds(trackArray[i].duration_ms),
        name: trackArray[i].name,
        trackNumber: trackArray[i].track_number
      }
      myArray.push(myObj);
    }

    const albumInfo = {
      albumID: albumData.body.id,
      albumTitle: albumData.body.name,
      spotifyUrl: albumData.body.external_urls.spotify,
      artistID: albumData.body.artists[0].id,
      albumArtBig: albumData.body.images[0].url,
      albumArtMedium: albumData.body.images[1].url,
      albumArtSmall: albumData.body.images[2].url,
      releaseDate: albumData.body.release_date,
      numTracks: albumData.body.total_tracks,
    }
    console.log(albumInfo);

    // get the reviews for the album
    // Receives a spotify album id
    // returns an array of objects with review text, their associated ratings, and usernames who wrote them
    const reviewData = await Rating.findAll({
      attributes: [['id','rating_id'],'score', 'review'],
      where: {
        album_id: req.params.album_id,   
        // only gets rating objects with reviews
        review: {
          [Op.ne]: null
        }   
      },
      include: [{
        model: User,
        attributes: [['id','user_id'], 'username']
      }],
    });

    const reviews = reviewData.map(review => review.get({plain: true}));

    const responseObj = {
      albumInfo: albumInfo,
      tracks: myArray,
      reviews: reviews
    }

    // ===========================================================
    // NOTE!!!!! CHANGE TO RES.RENDER WHEN TESTING WITH HANDLEBARS
    // ===========================================================
    // res.status(200).json(responseObj);
    res.render('albumPage', responseObj);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}


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
