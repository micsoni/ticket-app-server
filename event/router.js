const express = require("express");
const Ticket = require("../ticket/model");
const Event = require("./model");
const auth = require("../auth/middleware");
const router = express.Router();
const User = require("../user/model");
const { Op } = require("sequelize");


router.get("/event", async (req, res, next) => {
  const limit = Math.min(req.query.limit || 9, 500)
  const offset = req.query.offset || 0
  try {
    const showEvent = await Event.findAndCountAll({ where: {endDate:{[Op.gt]:new Date}},
      limit, offset
    });
    res.send(showEvent.rows);
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
