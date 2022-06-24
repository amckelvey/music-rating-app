const router = require('express').Router();
const { User, Rating, Review } = require('../../models');


// GET /api/review/:album_id
// Receives a spotify album id
// recevis an array of objects with review text, their associated ratings, and usernames who wrote them

// POST /api/review/
// Receives reivew info in the request
// user needs to be logged in
// creates a new review

// DELETE /api/review/:id
// Receives a review id
// user needs to be logged in
// deletes the review from the database

module.exports = router;
