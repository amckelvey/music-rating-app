const router = require('express').Router();
const { Op } = require("sequelize");
const { User, Rating} = require('../../models');
const withAuth = require('../../utils/auth');



// GET /api/review/:album_id
// Receives a spotify album id
// returns an array of objects with review text, their associated ratings, and usernames who wrote them
router.get('/:album_id', async (req, res) => {
  try {
    console.log("Get Reviews for album");
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
    if (!reviewData) {
      res.status(404).json({ message: 'No Review with this id!'});
      return;
    }
    res.status(200).json(reviewData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET /api/reviews/:user/:album_id
// user_id would passed in via the request object
// returns the id, text body of a review for that album and user
router.get('/:user_id/:album_id', async (req, res) => {
  try {
    console.log("Get Reviews for album by user user_id");
    const reviewData = await Rating.findOne({
      attributes: [['id','rating_id'],'score', 'review'],
      where: {
        album_id: req.params.album_id,
        user_id: req.params.user_id
      },
      include: [{
        model: User,
        attributes: [['id','user_id'], 'username']
      }],
    });
    if (!reviewData) {
      res.status(404).json({ message: 'No Review with this id!'});
      return;
    }
    const review = reviewData.get({ plain: true });
    res.status(200).json(review);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// POST /api/reviews/
// Receives reivew info in the request
// user needs to be logged in
// creates a new review
// needs withAuth middleware
router.post('/', async (req, res) => {
  // create a new category
  try {
    const reviewData = await Rating.create(req.body);
    res.status(200).json(reviewData);
  } catch (err) {
      res.status(500).json(err);
      console.log(err);
  }
});

// DELETE /api/reviews/:id
// Receives a review id
// user needs to be logged in
// setting a review to null
// needs withAuth middleware
router.delete('/:rating_id', async (req, res) => {
  // delete one product by its `id` value
  try {
    const reviewData = await Rating.update({ review: null }, {
      where: {
        id: rating_id,
        review: {
          [Op.ne]: null
        }   
      }
    });
    if (!reviewData) {
      res.status(404).json({ message: 'No Review with this Rating_id!'});
      return;
    }
    res.status(200).json(reviewData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;