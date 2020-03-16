const express = require("express");
const Comment = require("../comment/model");
const router = express.Router();
const auth = require("../auth/middleware");

router.post("/ticket/:ticketId/comment", auth, async (req, res, next) => {
  try {
    const postComment = await Comment.create(req.body);
    res.send(postComment);
  } catch (error) {
    next(error);
  }
});

module.exports = router;