const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Review extends Model {}

module.exports = Review;

Review.init(
  {
    // id. Integer, doesn't allow null values, set as primary key uses auto increment
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    // rating: the associated rating to the review 
    rating_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'rating',
        key: 'id',
      }
    },
    // album id (from spotify). String. Doesn't allow null values
    album_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // review. Text. Can be null.
    header: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // user_id. Integer. Doesn't allow null. Foreign key to user model.
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id',
      }
    }
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'rating',
  }
);