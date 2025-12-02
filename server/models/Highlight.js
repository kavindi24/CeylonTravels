const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Destination = require("./Destination");

const Highlight = sequelize.define("Highlight", {
  name: DataTypes.STRING,
  description: DataTypes.TEXT,
  image: DataTypes.STRING,
  bestTime: DataTypes.STRING,
  tips: DataTypes.STRING,
  destinationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Destinations', // table name
      key: 'id'
    },
    onDelete: 'CASCADE'
  }
});

module.exports = Highlight;
