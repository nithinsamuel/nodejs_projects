const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
// geocoder
const geocoder = require("../utils/geocoder");
// require the model
const Bootcamp = require("../models/Bootcamp");
// @desc    GET all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
// we can access the hello object from the request set in the logger middleware
// we are using async and await because mongoose methods return a promise
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  console.log("req.query", req.query);
  let query;
  // Copy of request.query
  const reqQuery = { ...req.query };
  console.log("reqQuery before remove", reqQuery);
  // Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];
  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);
  console.log("reqQuery after remove", reqQuery);
  // Create Query String
  // we create a new query string and add the "$" operator to the front because it becomes a mongoose operator - create operators ($gt,$gte,etc)
  let queryStr = JSON.stringify(reqQuery);
  // replace takes a regular expression
  // b - word boundary character,/ g is global
  // we will match for greater than greater than equal to and in is used for searching a list/array
  //second argument match returns the argument with a $ sign
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  console.log("queryStr", queryStr);
  // Finding Resource
  query = Bootcamp.find(JSON.parse(queryStr));
  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    console.log("fields", fields); //select=name,description - name description
    //query.select is a mongoose function for searching the mongo collection
    query = query.select(fields);
  }
  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    // default sortBy date
    query = query.sort("-createdAt");
  }
  // Pagination
  // we want the page no as number parsint() second parameter radix as 10
  //default page value is 1 if no values are passed
  const page = parseInt(req.query.page, 10) || 1;
  //limit displays the data per page
  const limit = parseInt(req.query.limit, 10) || 1;
  // startIndex - query .skip to skip a certain amount of resources/bootcamps
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  // total amount of documents
  //.countDocuments() is a mongoose method used to count all the documents
  const total = await Bootcamp.countDocuments();
  //.query.skip(100).limit(20) - Specifies the number of documents to skip.
  //this can be used to go to next page-it skips the said records
  query = query.skip(startIndex).limit(limit);
  // Executing our Query
  // return all bootcamps without any filters
  // const bootcamps = await Bootcamp.find();
  // return bootcamps with a filter search - averageCost[lte]=10000, averageCost[gt]=5000
  const bootcamps = await query;
  // Pagination Result
  const pagination = {};
  // if on first page don't show previous button, if on last page don't show the last button
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps,
  });
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
// Calc radius using radians
// @route   GET/api/v1/bootcamps/radius/:zipcode/:distance
// @access  Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  //first argument -req.params.id-- take id from url
  const { zipcode, distance } = req.params;
  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitute;
  // Calc radius using radians (radians is a unit of measurement for spheres)
  // Divide dist by radius of earth
  // Earth Radius = 3,663 mi / 6,378 km
  const radius = distance / 3963;
  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});
