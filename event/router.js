const express = require("express");
const Ticket = require("../ticket/model");
const Event = require("./model");
const auth = require("../auth/middleware");
const router = express.Router();
const User = require("../user/model");
const { Op } = require("sequelize");
const getTicketRisk = require("../ticket/RiskFunction");

router.get("/event", async (req, res, next) => {
  const limit = Math.min(req.query.limit || 9, 500);
  const offset = req.query.offset || 0;
  try {
    const showEvent = await Event.findAndCountAll({
      where: { endDate: { [Op.gt]: new Date() } },
      limit,
      offset
    });
    res.send(showEvent);
  } catch (error) {
    next(error);
  }
});

router.get("/event/:eventId", async (req, res, next) => {
  try {
    const eventFound = await Event.findByPk(req.params.eventId, {
      include: { model: Ticket, include: [User] }
    });
    if (!eventFound) {
      res.status(404).send("Event not found");
    } else {
      // calculate ticket risk for all tickets of an event and put it in each ticket
      if (eventFound.tickets.length === 0) {
        res.send(eventFound);
      } else {
        const eventTicketsWithRisk = eventFound.tickets.map(async ticket => {
          ticket.dataValues.risk = await getTicketRisk(ticket);
          return ticket;
        });

        eventFound.tickets = await Promise.all(eventTicketsWithRisk);
        res.send(eventFound);
      }
    }
  } catch (error) {
    next(error);
  }
});

router.post("/event", auth, async (req, res, next) => {
  try {
    const postEvent = await Event.create(req.body);
    res.send(postEvent);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
