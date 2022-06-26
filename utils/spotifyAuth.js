var SpotifyWebApi = require('spotify-web-api-node');

// copied from https://github.com/thelinmichael/spotify-web-api-node/blob/master/examples/access-token-using-client-credentials.js
const spotifyAuth = async (req, res, next) => {
  if (!req.session.spotify_token || Date.now() > req.session.spotify_token_expires) {
    var clientId = 'b8613864536c4491b058d23befbec540',
    clientSecret = 'fadd7cafd3d840d7b4d14180fc84ebb4';
    spotifyApi = new SpotifyWebApi({
      clientId: clientId,
      clientSecret: clientSecret
    });
  
    let data;
    try {
      data = await spotifyApi.clientCredentialsGrant();
      req.session.save(() => {
        req.session.spotify_token = data.body['access_token'];
        req.session.spotify_token_expires = Date.now() + (data.body['expires_in'] * 1000);
        console.log('The access token expires in ' + data.body['expires_in']);
        console.log('The access token is ' + data.body['access_token']);
    
        // Save the access token so that it's used in future calls
        spotifyApi.setAccessToken(data.body['access_token']);
        console.log(spotifyApi);
        req.session.spotifyApi =spotifyApi ;
        next();
    });
    } catch (err) {
      console.log('Something went wrong when retrieving an access token', err);
      next();
    }
  } else {
    console.log("Spotify authorization not needed");
    next();
  }
};
  
module.exports = spotifyAuth;