const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const Img = require("./imgModels");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  universityEmail: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  universityName: {
    type: String,
    required: true,
  },
  studentId: {
    type: Number,
    unique: true,
  },
  campusLocation: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["driver", "passenger"],
  },
  profilePic: {
    type: Schema.Types.ObjectId,
    ref: "Img",
  },
  studentIdPic: {
    type: String,
    required: true,
  },
  vehicleNumber: {
    type: String,
    required: function () {
      return this.role === "driver";
    },
  },
  driverLicensePic: {
    type: String,
    required: function () {
      return this.role === "driver";
    },
  },
});

userSchema.statics.login = async function (universityEmail, password) {
  // Validate that email and password are provided
  if (!universityEmail || !password) {
    throw Error("Email and password are required");
  }

  // Find the user by email
  const user = await this.findOne({ universityEmail });
  if (!user) {
    throw Error("User does not exist");
  }

  // Check if the provided password matches the hashed password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw Error("Incorrect password");
  }

  return user;
};

userSchema.statics.signup = async function (
  universityEmail,
  password,
  first_name,
  last_name,
  universityName,
  studentId,
  campusLocation,
  phoneNumber,
  location,
  role,
  studentIdPic,
  vehicleNumber,
  driverLicensePic
) {
  // Validation
  if (
    !universityEmail ||
    !password ||
    !first_name ||
    !last_name ||
    !universityName ||
    !campusLocation ||
    !phoneNumber ||
    !location ||
    !role ||
    !studentIdPic
  ) {
    throw Error("All fields must be filled");
  }

  if (!validator.isEmail(universityEmail)) {
    throw Error("Email not valid");
  }

  if (!validator.isStrongPassword(password)) {
    throw Error("Password not strong enough");
  }

  if (role === "driver") {
    if (!vehicleNumber || !driverLicensePic) {
      throw Error("Drivers must provide vehicle ID and driver license");
    }
  }

  const exists = await this.findOne({ universityEmail });
  if (exists) {
    throw Error("Email already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({
    universityEmail,
    password: hash,
    first_name,
    last_name,
    universityName,
    studentId,
    campusLocation,
    phoneNumber,
    location,
    role,
    studentIdPic,
    vehicleNumber: role === "driver" ? vehicleNumber : null,
    driverLicensePic: role === "driver" ? driverLicensePic : null,
  });

  return user;
};

module.exports = mongoose.model("User", userSchema);
