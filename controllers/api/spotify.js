var SpotifyWebApi = require('spotify-web-api-node');

// GET /api/rating/:artist
// Receives an artist name input by the user
// does a GET /v1/search search query to spotify to get the artist_id
// does a GET /v1/artists/{artist_id}/albums request to get album info
// Returns the relevant album info

