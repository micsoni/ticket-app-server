const express = require("express");
const paginate = require("express-paginate");
const { Op } = require("sequelize");
const Ticket = require("../ticket/model");
const Event = require("./model");
const auth = require("../auth/middleware");
const User = require("../user/model");
const getTicketRisk = require("../ticket/RiskFunction");

const router = express.Router();

router.get("/event", async (req, res, next) => {
  const limit = Math.min(req.query.limit || 9, 50);
  const offset = req.query.offset || 0;
  try {
    const allEvents = await Event.findAndCountAll({
      where: { endDate: { [Op.gt]: new Date() } },
      limit,
      offset
    });
    allEvents.pageCount = Math.ceil(allEvents.count / limit);
    allEvents.pages = paginate.getArrayPages(req)(
      9,
      allEvents.pageCount,
      req.query.page
    );
    res.send(allEvents);
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
      res.status(404).send({message:"Event not found"});
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

//added this router so I can update events (it is not used in the frontend)
router.put("/event/:eventId", async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.eventId);
    const updated = await event.update(req.body);
    res.send(updated);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
