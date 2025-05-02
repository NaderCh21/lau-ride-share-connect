const express = require("express");

const auth = require("../middlewares/requireAuth");

const { upload } = require("../middlewares/upload");

const userRoutes = express.Router();

const {
  updateInfo,
  loginUser,
  signupUser,
  generateQRCode,
} = require("../controllers/userController");

userRoutes.patch("/updateInfo", auth, updateInfo);

userRoutes.post("/login", loginUser);

userRoutes.post(
  "/signup",
  upload.fields([
    { name: "studentIdPic", maxCount: 1 },
    { name: "driverLicensePic", maxCount: 1 },
  ]),
  (req, res, next) => {
    console.log("Body:", req.body);
    console.log("Files:", req.files);

    next();
  },
  signupUser
);

userRoutes.get("/generate-qr", auth, generateQRCode);

module.exports = userRoutes;
