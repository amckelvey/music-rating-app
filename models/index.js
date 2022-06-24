const User = require('./User');
const Rating = require('./Rating');

User.hasMany(Rating, {
  foreignKey: 'user_id',
});

Rating.belongsTo(User);

module.exports = { User, Rating };
