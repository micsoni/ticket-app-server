const express = require("express");
const Ticket = require("../ticket/model");
const Event = require("./model");
const auth = require("../auth/middleware");
const router = express.Router();

router.get("/event", async (req, res, next) => {
  try {
    const showEvent = await Event.findAll();
    res.send(showEvent);
  } catch (error) {
    next(error);
  }
});

router.get("/event/:eventId", async (req, res, next) => {
  try {
    const eventFound = await Event.findByPk(req.params.eventId, {
      include: [Ticket]
    });
    if (!eventFound) {
      res.status(404).send("Event not found");
    } else {
      res.send(eventFound);
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