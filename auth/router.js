const { Router } = require("express");
const { toJWT } = require("./jwt");
const User = require("../user/model");
const bcrypt = require("bcrypt");
const auth = require("./middleware");

const router = new Router();

router.post("/login", async (req, res, next) => {
  try {
    const loginInfo = req.body;
    if (!loginInfo.email || !loginInfo.password) {
      res.status(400).send({
        message: "Please supply a valid email and password"
      });
    } else {
      const userFound = await User.findOne({
        where: {
          email: loginInfo.email
        }
      });
      if (!userFound) {
        res.status(400).send({
          message: "User with that email does not exist"
        });
      } else if (bcrypt.compareSync(loginInfo.password, userFound.password)) {
        res.send({
          //send jwt to make the login after signup
          jwt: toJWT({ userId: userFound.id }),
          id: userFound.id,
          name: userFound.username
        });
      } else {
        res.status(400).send({
          message: "Password was incorrect"
        });
      }
    }
  } catch (error) {
    next(error);
  }
});

//testing auth
router.get("/secret-endpoint", auth, (req, res) => {
  res.send({
    message: `Thanks for visiting the secret endpoint ${req.user.email}.`
  });
});

module.exports = router;
