const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
// require the model
const Course = require("../models/Course");
//this method is used for two different routes
// @desc    GET courses
// @route-1   GET /api/v1/courses --route will get all courses
// @route-2   GET /api/v1/bootcamps/:bootcampId/courses--route will get all the specific courses for a specific bootcamp
// @access  Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;
  if (req.params.bootcampId) {
    //   @route-1
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    // @route-2
    query = Course.find();
  }
  const courses = await query;

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});
