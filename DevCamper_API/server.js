const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");
const colors = require("colors");
// Load env vars
dotenv.config({ path: "./config/config.env" });
// connect to database
connectDB();
// Route Files from Express Router
const bootcamps = require("./routes/bootcamps");
// initialize app variable
const app = express();

//Dev logging middleware - morgan
//run only in dev environment
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// Mount Route to specific URL
app.use("/api/v1/bootcamps", bootcamps);

const PORT = process.env.PORT || 5000;
// in order to run a server we neeed to call listlsen passing a port no
const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
//Globally Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error:${err.message}`.red);
  // close the server and exit process
  server.close(() => process.exit(1));
});
