const Sequelize = require("sequelize");
const db = require("../db");
const Ticket = require("../ticket/model");

const Event = db.define(
  "event",
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    pictureUrl: {
      type: Sequelize.STRING,
      allowNull: false
    },
    startDate: {
      type: Sequelize.DATEONLY,
      allowNull: false
    },
    endDate: {
      type: Sequelize.DATEONLY,
      allowNull: false
    }
  },
  {
    timestamps: false
  }
);

//ticket relation with event
Ticket.belongsTo(Event);
Event.hasMany(Ticket);

module.exports = Event;
