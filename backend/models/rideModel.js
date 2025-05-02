const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const rideSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  route: {
    type: String,
    required: true,
  },
  pickupLocation: {
    type: String,
    required: true,
  },
  driverId: {
    type: String,
    ref: "User",
    required: true,
  },
  availableSeats: {
    type: Number,
    required: true,
  },
  passengerIdsList: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },
  pendingRequests: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },
  punchInTime: { type: Date },
  punchOutTime: { type: Date },
});

module.exports = mongoose.model("Ride", rideSchema);
