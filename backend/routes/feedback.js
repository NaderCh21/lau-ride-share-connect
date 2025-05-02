const express = require("express");

const router = express.Router();
const {
  submitFeedback,
  getRideFeedback,
} = require("../controllers/feedbackController");

const { authenticateUser } = require("../middlewares/requireAuth");

router.post("/submit", authenticateUser, submitFeedback);

router.get("/ride/:rideId", authenticateUser, getRideFeedback);

module.exports = router;
