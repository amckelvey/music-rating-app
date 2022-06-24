const router = require('express').Router();
const userRoutes = require('./userRoutes');
const ratingRoutes = require('./ratingRoutes');
const reviewRoutes = require('./reviewRoutes');

router.use('/users', userRoutes);
router.use('/ratings/', ratingRoutes);
router.use('/reviews/', reviewRoutes);

module.exports = router;
