const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/requireAuth");

const {
  getRides,
  punchInRide,
  punchOutRide,
  addRide,
  deleteRide,
  getSpecificRide,
  getDriverRides,
  respondToRequest,
  requestRide,
  triggerSOS,
} = require("../controllers/rideController");

router.get("/getAllRides", authMiddleware, getRides);
router.get("/getSpecificRide", authMiddleware, getSpecificRide);
router.patch("/punch-in/:rideId", authMiddleware, punchInRide);
router.patch("/punch-out/:rideId", authMiddleware, punchOutRide);
router.post("/sos", authMiddleware, triggerSOS);

router.post("/driver/addRide", authMiddleware, addRide);
router.post("/driver/deleteRide/:rideId", authMiddleware, deleteRide);
router.get("/driver/My-rides", authMiddleware, getDriverRides);

router.post("/respond", authMiddleware, respondToRequest);
router.post("/request", authMiddleware, requestRide);

module.exports = router;
