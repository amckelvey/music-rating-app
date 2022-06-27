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

// GET /api/spotify/search/:artist
// does a GET /v1/search search query to spotify to get the artist_id
router.get('/search/:artist', spotifyAuth, async (req, res) => {
  try {
    const spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });
     // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(req.session.spotify_token);
    // hard coded to pick most popular result
    const searchArtistData = await spotifyApi.searchArtists(req.params.artist, {limit: 1});
    const artistId = searchArtistData.body.artists.items[0].id;
    res.status(200).json(artistId);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


// GET /api/spotify/albums/:artist
// Receives an artist name input by the user
// does a GET /v1/search search query to spotify to get the artist_id
// does a GET /v1/artists/{artist_id}/albums request to get album info
// Returns an array of album info, also returns artist_id
router.get('/albums/:artist', spotifyAuth, async (req, res) => {
  try {
    const spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });
     // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(req.session.spotify_token);
    // hard coded to pick most popular result
    const searchArtistData = await spotifyApi.searchArtists(req.params.artist, {limit: 1});
    const artistId = searchArtistData.body.artists.items[0].id;
    const albumData = await spotifyApi.getArtistAlbums(artistId ,{include_groups: 'album', market: 'US', limit: '50'});
    // also gives artist ID back
    const albumArray = albumData.body.items;
    const artistAlbums = [];
    for (let i = 0; i < albumArray.length; i++) {
      const myObj = {
        albumID: albumArray[i].id,
        albumTitle: albumArray[i].name,
        spotifyUrl: albumArray[i].external_urls.spotify,
        artistID: albumArray[i].artists[0].id,
        albumArtUrl: albumArray[i].images[0].url,
        releaseDate: albumArray[i].release_date,
        // numTracks: albumArray[i].total_tracks
      }
      artistAlbums.push(myObj);
    }
    res.status(200).json(artistAlbums);
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
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });
    spotifyApi.setAccessToken(req.session.spotify_token);
    const artistID = req.params.artist_id;
    const artistData = await spotifyApi.getArtist(artistID);

    const artistInfo = {
      spotifyUrl: artistData.body.external_urls.spotify,
      genres: artistData.body.genres,
      name: artistData.body.name,
      artistImageUrl: artistData.body.images[0].url,
    }

    res.status(200).json(artistInfo);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET /api/spotify/related/:artist_id
router.get('/related/:artist_id', spotifyAuth, async (req, res) => {
  console.log("In related route");
  try {
    const spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });
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

    res.status(200).json(relatedArtists);
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
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
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
    res.status(200).json(newReleases);
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
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });
    spotifyApi.setAccessToken(req.session.spotify_token);
    const albumID = req.params.album_id;
    const trackData = await spotifyApi.getAlbumTracks(albumID);
    const trackArray = trackData.body.items;
    const myArray = [];
    for (let i = 0; i < trackArray.length; i++) {
      const myObj = {
        durationMs: millisToMinutesAndSeconds(trackArray[i].duration_ms),
        name: trackArray[i].name,
        trackNumber: trackArray[i].track_number
      }
      myArray.push(myObj);
    }
    res.status(200).json(myArray);
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



module.exports = router;

