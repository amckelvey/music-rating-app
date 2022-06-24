const router = require('express').Router();
const { User, Rating} = require('../../models');


// GET /api/review/:album_id
// Receives a spotify album id
// returns an array of objects with review text, their associated ratings, and usernames who wrote them

// GET /api/review/:user/:album_id
// user_id would passed in via the request object
// returns the id, text body of a review for that album and user

// findAll, attributes username, body, score; where album_id and user_id matches

// POST /api/review/
// Receives reivew info in the request
// user needs to be logged in
// creates a new review

// DELETE /api/review/:id
// Receives a review id
// user needs to be logged in
// setting a review to null

module.exports = router;

// dua lipa artist_id 6M2wZ9GZgrQXHCFfjv46we
// future nostalgia album_id 7fJJK56U9fHixgO0HQkhtI