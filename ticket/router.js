const express = require("express");
const Ticket = require("../ticket/model");
const auth = require("../auth/middleware");
const router = express.Router();

router.get("/ticket/:ticketId", async (req, res, next) => {
  try {
    const ticketFound = await Ticket.findByPk(req.params.ticketId, {
      include: { all: true, nested: false }
    });
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
    const updated = await ticket.update(req.body);
    res.send(updated);
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
