const express = require("express");
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
} = require("../controllers/bootcamps");
// initialize Router
const router = express.Router();
// router methods where id is not required
//we chain similar route functions here
// getting the bootcamps within a radius
router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);
router.route("/").get(getBootcamps).post(createBootcamp);
// router methods where id is required
router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);
// export the router
module.exports = router;
