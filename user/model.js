const Sequelize = require("sequelize");
const db = require("../db");
const Comment = require("../comment/model");
const Ticket = require("../ticket/model");

const User = db.define(
  "user",
  {
    username: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  {
    timestamps: false
  }
);

//comment relation with user
Comment.belongsTo(User);
User.hasMany(Comment);

//ticket relation with user
Ticket.belongsTo(User);
User.hasMany(Ticket);

module.exports = User;
