const router = require('express').Router();
const { User, Rating } = require('../../models');


// GET /api/rating/average/:album_id
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
    // also return number of votes
    res.status(200).json(average);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// // GET /api/rating/:user_id/:album_id
// Receives a spotify album id, and user_id through the req body
// uses findOne
// returns review score for the one album
// req.params.album_id
router.get('/:user_id/:album_id', async (req, res) => {
  try {
    console.log("Get Ratings for album");
    const scoreData = await Rating.findOne({
      attributes: ['score'],
      where: {
        album_id: req.params.album_id,
        user_id: req.params.user_id
      }
    });
    const { score } = scoreData.get({ plain: true });
    res.status(200).json(score);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// POST /api/rating/
// Receives rating info in the request
// checks if the user is logged in
// creates a new rating
router.post('/', async (req, res) => {
  // create a new category
  try {
    const ratingData = await Rating.create(req.body);
    res.status(200).json(ratingData);
  } catch (err) {
      res.status(500).json(err);
      console.log(err);
  }
});


// PUT /api/rating/:id
// Receives rating a rating id, will need to check the user_id and album_id
// checks if the user is logged in
// updates an existing rating



module.exports = router;

// this may need to be done in another file, using spotify routes

// GET /api/rating/:artist
// Receives an artist name input by the user
// does a GET /v1/search search query to spotify to get the artist_id
// does a GET /v1/artists/{artist_id}/albums request to get album info
// Returns the relevant album info