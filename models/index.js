const User = require('./User');
const Rating = require('./Rating');
const Review = require('./Review');

User.hasMany(Rating, {
  foreignKey: 'user_id',
});

Rating.belongsTo(User);

User.hasMany(Review, {
  foreignKey: 'user_id',
});

Rating.hasOne(Review);

Review.belongsTo(Rating, {
  foreignKey: 'rating_id'
});




module.exports = { User, Rating, Review };
