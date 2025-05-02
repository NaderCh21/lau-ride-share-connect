const Ride = require("../models/rideModel");
const User = require("../models/userModel");

// Both
// Get all available rides
const getRides = async (req, res) => {
  try {
    const rides = await Ride.find().populate();
    res.status(200).json(rides);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getSpecificRide = async (req, res) => {
  try {
    const { year, month, day, time, pickupLocation, route } = req.body;

    const dateString = `${year}-${String(month).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}T${time}:00.000Z`;
    const targetDate = new Date(dateString);

    const ride = await Ride.findOne({
      date: targetDate,
      pickupLocation: pickupLocation,
      route: route,
    });

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    res.status(200).json(ride);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving ride", error });
  }
};

const punchInRide = async (req, res) => {
  try {
    const { rideId } = req.params;
    const ride = await Ride.findById(rideId);

    if (!ride) return res.status(404).json({ message: "Ride not found" });

    // Ensure the user is part of the ride
    if (ride.driverId.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    // Check if already punched in
    if (ride.punchInTime)
      return res.status(400).json({ message: "Already punched in" });

    ride.punchInTime = new Date();
    await ride.save();

    res.status(200).json({ message: "Punched in successfully", ride });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const punchOutRide = async (req, res) => {
  try {
    const { rideId } = req.params;
    const ride = await Ride.findById(rideId);

    if (!ride) return res.status(404).json({ message: "Ride not found" });

    if (ride.driverId.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    // Check if punched in already
    if (!ride.punchInTime)
      return res.status(400).json({ message: "Punch in first" });

    // Check if already punched out
    if (ride.punchOutTime)
      return res.status(400).json({ message: "Already punched out" });

    ride.punchOutTime = new Date();
    await ride.save();

    res.status(200).json({ message: "Punched out successfully", ride });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const triggerSOS = async (req, res) => {
  try {
    const userId = req.user._id;
    const { rideId } = req.body;

    const ride = await Ride.findById(rideId).populate(
      "driverId passengerIdsList"
    );

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    const sosInfo = {
      userId,
      rideDetails: {
        rideId: ride._id,
        driver: ride.driverId,
        passengers: ride.passengerIdsList,
        location: ride.pickupLocation,
        date: ride.date,
      },
      timestamp: new Date(),
    };

    console.log("🚨 SOS Triggered", sosInfo);

    res.status(200).json({ message: "SOS alert has been triggered", sosInfo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Driver
const getDriverRides = async (req, res) => {
  try {
    const driverId = req.user.id;

    const rides = await Ride.find({ driverId }).sort({ date: 1 });

    res.status(200).json(rides);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Add a new ride
const addRide = async (req, res) => {
  try {
    const { date, route, pickupLocation, availableSeats } = req.body;
    const driverID = req.user.id;

    if (!date || !route || !pickupLocation || availableSeats === undefined) {
      return res.status(400).json({ message: "All fields must be filled." });
    }

    // Create new ride
    const newRide = new Ride({
      date,
      route,
      pickupLocation,
      driverId: driverID,
      availableSeats,
    });

    await newRide.save();
    res.status(201).json({ message: "Ride added successfully", ride: newRide });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a ride
const deleteRide = async (req, res) => {
  try {
    const { rideId } = req.params;
    const driverId = req.user.id;

    // Find the ride
    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    if (ride.driverId !== driverId) {
      return res.status(403).json({ message: "You can only delete your ride" });
    }

    const now = new Date();
    const rideDate = new Date(ride.date);
    const timeDifference = rideDate - now;

    // Check if the ride is at least 24 hours away
    if (timeDifference < 24 * 60 * 60 * 1000) {
      return res.status(400).json({
        message: "You can only delete a ride at least 24 hours in advance",
      });
    }

    // Delete the ride
    await Ride.findByIdAndDelete(rideId);
    res.status(200).json({ message: "Ride deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const respondToRequest = async (req, res) => {
  try {
    const { rideId, passengerId, action } = req.body;
    const driverId = req.user.id;

    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ message: "Ride not found" });
    if (ride.driverId !== driverId)
      return res.status(403).json({ message: "Not authorized" });

    const index = ride.pendingRequests.indexOf(passengerId);
    if (index === -1)
      return res.status(400).json({ message: "No such pending request" });

    ride.pendingRequests.splice(index, 1);

    if (action === "accept") {
      if (ride.availableSeats <= ride.passengerIdsList.length) {
        return res.status(400).json({ message: "No available seats" });
      }
      ride.passengerIdsList.push(passengerId);
    }

    await ride.save();
    res.status(200).json({ message: `Request ${action}ed successfully` });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//Passenger
const requestRide = async (req, res) => {
  try {
    const userId = req.user.id;
    const { rideId } = req.body;

    const ride = await Ride.findById(rideId);

    if (!ride) return res.status(404).json({ message: "Ride not found" });
    if (
      ride.pendingRequests.includes(userId) ||
      ride.passengerIdsList.includes(userId)
    ) {
      return res.status(400).json({ message: "Already requested or accepted" });
    }

    ride.pendingRequests.push(userId);
    await ride.save();

    res.status(200).json({ message: "Ride request sent" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  addRide,
  getDriverRides,
  getRides,
  deleteRide,
  getSpecificRide,
  requestRide,
  respondToRequest,
  punchInRide,
  punchOutRide,
  triggerSOS,
};
