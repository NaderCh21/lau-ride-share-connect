const express = require("express");

const router = express.Router();
const {
  reportDriver,
  getReportsForDriver,
} = require("../controllers/reportController");
const { authenticateUser } = require("../middlewares/requireAuth");

router.post("/report", authenticateUser, reportDriver);

module.exports = router;
