const express = require("express");
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
} = require("../controllers/bootcamps");
// Include other resource routers
//{{URL}}/api/v1/bootcamps/5d713a66ec8f2b88b8f830b8/courses
const courseRouter = require("./courses");

// initialize Router
const router = express.Router();
// re-route into other resource routers--pass it on to the course router
//if this path is hit /:bootcampId/courses then getCourses route in courses.js is called
router.use("/:bootcampId/courses", courseRouter);

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
