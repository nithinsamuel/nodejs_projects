// require the model
const Bootcamp = require("../models/Bootcamp");
// @desc    GET all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
// we can access the hello object from the request set in the logger middleware
// we are using async and await because mongoose methods return a promise
exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();
    res
      .status(200)
      .json({ success: true, count: bootcamps.length, data: bootcamps });
  } catch {
    res.status(400).json({ success: false });
  }
};

// @desc    GET single bootcamps
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    // if we are providing an invalid bootcamp
    //since we are providing multiple res.status for success:true we need to provide return to first response else we will get an error that the headers are already set
    if (!bootcamp) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: bootcamp });
  } catch {
    res.status(400).json({ success: false });
  }
};

// @desc    Create new bootcamps
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = async (req, res, next) => {
  // console.log("req.body", req.body);
  try {
    // data will be saved to db
    const bootcamp = await Bootcamp.create(req.body);
    // res.status(200).json({ success: true, msg: "Create new bootcamp" });
    res.status(201).json({ success: true, data: bootcamp });
  } catch (err) {
    // in case of error we will return the success false
    res.status(400).json({ success: false });
    console.log("err", err);
  }
};

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = async (req, res, next) => {
  try {
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
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: bootcamp });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc    Delete bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = async (req, res, next) => {
  try {
    //first argument -req.params.id-- take id from url
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    // if bootcamp does not exist return a success:false message
    if (!bootcamp) {
      return res.status(400).json({ success: false });
    }
    // return an empty object if data is deleted
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};
