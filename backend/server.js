//Importing express
const express = require("express");
const cors = require("cors");

//Importing dotenv that allows to load environment variables from a .env file into process.env
require("dotenv").config();

//Importing Mongoose to connect to the database on mongodb atlas
const mongoose = require("mongoose");

const app = express();

// Allow all origins (or you can specify a specific domain)
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

const userRoutes = require("./routes/user");
const rideRoutes = require("./routes/ride");

//Middleware build into Express to parse incoming JSON requests
app.use(express.json());

app.use("/user", userRoutes);
app.use("/rides", rideRoutes);

//Connect to the database
mongoose
  .connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Listening on port", process.env.PORT);
      console.log("Connected to the Database successfully");
    });
  })
  .catch((error) => console.log(error));
