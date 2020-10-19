const express = require("express");
const dotenv = require("dotenv");
// Load env vars
dotenv.config({ path: "./config/config.env" });
// initialize app variable
const app = express();
const PORT = process.env.PORT || 5000;
// in order to run a server we neeed to call listen passing a port no
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
