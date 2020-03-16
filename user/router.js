const express = require('express')
const User = require('./model')
const bcrypt = require('bcrypt')
const { toJWT } = require("../auth/jwt");
const router = express.Router();

router.post("/user", async (req, res, next) => {
  try {
    const userCredentials = {
      email: req.body.email,
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 10)
    };
    if (!userCredentials.email || !userCredentials.password) {
      res.status(400).send({
        message: "Please supply a valid email and password"
      });
    } else {
      const createUser = await User.create(userCredentials);
      const jwt = toJWT({ userId: createUser.id });
      res.send({
        jwt,
        id: createUser.id,
        username: createUser.username
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router