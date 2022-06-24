const router = require('express').Router();
const { User, Rating } = require('../../models');


// GET /api/rating/:album_id
// Receives a spotify album id
// returns the ratings scores of that album
// req.params.album_id
router.get('/:album_id', async (req, res) => {
  try {
    console.log("Get Ratings for album");
    console.log("Album id is: " + req.params.album_id);
    const dbscoreData = await Rating.findAll({
      attributes: ['score'],
      where: {
        album_id: req.params.album_id
      }
    });

    // const scoreData = dbscoreData.get({ plain: true });
    res.status(200).json(dbscoreData);
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