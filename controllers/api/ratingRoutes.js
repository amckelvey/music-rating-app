const router = require('express').Router();
const { User, Rating } = require('../../models');


// GET /api/rating/:album_id
// Receives a spotify album id
// returns the average score of that album
// req.params.album_id
router.get('/average/:album_id', async (req, res) => {
  try {
    console.log("Get Ratings for album");
    const scoreData = await Rating.findAll({
      attributes: ['score'],
      where: {
        album_id: req.params.album_id
      }
    });
    let scores = scoreData.map((score) => score.score);
    let total = 0;
    for(let i = 0; i < scores.length; i++) {
      total += scores[i];
    }
    const rawAvg = total / scores.length;
    const average = Math.round(rawAvg * 10) / 10
    res.status(200).json(average);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// POST /api/rating/
// Receives rating info in the request
// creates a new rating

// PUT /api/rating/:id
// Receives rating a rating id, will need to check the user_id and album_id
// updates an existing rating

//





module.exports = router;

// this may need to be done in another file

// GET /api/rating/:artist
// Receives an artist name input by the user
// does a GET /v1/search search query to spotify to get the artist_id
// does a GET /v1/artists/{artist_id}/albums request to get album info
// Returns the relevant album info