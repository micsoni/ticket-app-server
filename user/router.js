const express = require("express");
const bcrypt = require("bcrypt");
const User = require("./model");
const Event = require("../event/model");
const Ticket = require("../ticket/model");
const { toJWT } = require("../auth/jwt");

const router = express.Router();

router.post("/user", async (req, res, next) => {
  try {
    const userCredentials = {
      email: req.body.email,
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 10)
    };
    if (
      !userCredentials.email ||
      !userCredentials.password ||
      !userCredentials.username
    ) {
      res
        .status(400)
        .send({
          message: "Please supply a valid username, email and password"
        });
    } else {
      const createdUser = await User.create(userCredentials);
      const jwt = toJWT({ userId: createdUser.id });
      res.send({
        jwt,
        id: createdUser.id,
        username: createdUser.username
      });
    }
  } catch (error) {
    next(error);
  }
});

router.get("/user/:userId", async (req, res, next) => {
  try {
    const userFound = await User.findByPk(req.params.userId, {
      include: { model: Ticket, include: [Event] }
    });

    if (!userFound) {
      res.status(404).send({ message: "User not found" });
    } else {
      res.send(userFound);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
