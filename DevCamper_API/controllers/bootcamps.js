const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
// require the model
const Bootcamp = require("../models/Bootcamp");
// @desc    GET all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
// we can access the hello object from the request set in the logger middleware
// we are using async and await because mongoose methods return a promise
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.find();
  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});

// @desc    GET single bootcamps
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  // if we are providing an invalid bootcamp
  //since we are providing multiple res.status for success:true we need to provide return to first response else we will get an error that the headers are already set
  if (!bootcamp) {
    // return error if the bootcamp is not available in the db
    // return custom error message
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});

// @desc    Create new bootcamps
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  // console.log("req.body", req.body);

  // data will be saved to db
  const bootcamp = await Bootcamp.create(req.body);
  // res.status(200).json({ success: true, msg: "Create new bootcamp" });
  res.status(201).json({ success: true, data: bootcamp });
});

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  //first argument -req.params.id-- take id from url
  //second argument -req.body-- what we want to insert
  //third argument -options object{}
  //-- new:true-data to be updated new true
  //--runValidators-runs the mongoose validators
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  // if bootcamp does not exist return a success:false message
  if (!bootcamp) {
    // return res.status(400).json({ success: false });
    // return error using next
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});

// @desc    Delete bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  //first argument -req.params.id-- take id from url
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
  // if bootcamp does not exist return a success:false message
  if (!bootcamp) {
    // return res.status(400).json({ success: false });
    // return error using next
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  // return an empty object if data is deleted
  res.status(200).json({ success: true, data: {} });
});
