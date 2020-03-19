const express = require("express");
const Ticket = require("../ticket/model");
const auth = require("../auth/middleware");
const Comment = require("../comment/model");
const User = require("../user/model");
const Event = require("../event/model");
const getTicketRisk = require("./RiskFunction");

const router = express.Router();

router.get("/ticket/:ticketId", async (req, res, next) => {
  try {
    const ticketFound = await Ticket.findByPk(req.params.ticketId, {
      include: [{ model: Comment, include: [User] }, Event, User]
    });

    // calculate ticket risk and put it in the ticket
    ticketFound.dataValues.risk = await getTicketRisk(ticketFound);

    if (!ticketFound) {
      res.status(404).send("Ticket not found");
    } else {
      res.send(ticketFound);
    }
  } catch (error) {
    next(error);
  }
});

router.post("/ticket", auth, async (req, res, next) => {
  try {
    const postEvent = await Ticket.create(req.body);
    res.send(postEvent);
  } catch (error) {
    next(error);
  }
});

router.put("/ticket/:ticketId", auth, async (req, res, next) => {
  try {
    const ticket = await Ticket.findByPk(req.params.ticketId);
    const userAuthorized =
      req.user.dataValues.id === ticket.userId ? true : false;
    if (userAuthorized) {
      const updated = await ticket.update(req.body);
      res.send(updated);
    } else {
      res.status(401).send("User not authorized");
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/ticket/:ticketId", auth, async (req, res, next) => {
  try {
    const number = await Ticket.destroy({ where: { id: req.params.ticketId } });
    if (number === 0) {
      res.status(404).send("No ticket found");
    } else {
      res.status(202).json(number);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
