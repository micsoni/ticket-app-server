const Sequelize = require("sequelize");
const db = require("../db");
const Comment = require("../comment/model");

const Ticket = db.define("ticket", {
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  pictureUrl: {
    type: Sequelize.STRING,
    allowNull: true
  }
});

//comment relation with ticket
Comment.belongsTo(Ticket);
Ticket.hasMany(Comment);

module.exports = Ticket;
