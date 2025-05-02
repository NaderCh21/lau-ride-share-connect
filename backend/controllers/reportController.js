const Report = require("../models/reportModel");
const User = require("../models/userModel");

// Report a driver for unsafe behavior
const reportDriver = async (req, res) => {
  try {
    const { rideId, driverId, reason, details } = req.body;
    const userId = req.user.id;

    if (userId === driverId) {
      return res.status(400).json({ message: "You cannot report yourself." });
    }

    const newReport = new Report({
      rideId,
      userId,
      driverId,
      reason,
      details,
    });

    await newReport.save();

    const driverReports = await Report.find({
      driverId,
      reason: "Aggressive Driving",
    });

    if (driverReports.length > 3) {
      const driver = await User.findById(driverId);
      if (driver) {
        driver.role = "passenger";
        await driver.save();
      }
    }

    res.status(200).json({ message: "Report submitted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  reportDriver,
};
