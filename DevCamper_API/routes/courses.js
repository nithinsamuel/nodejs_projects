const express = require("express");
const { getCourses } = require("../controllers/courses");
// initialize Router
// { mergeParams: true } is used to merging the url params from courses
const router = express.Router({ mergeParams: true });
router.route("/").get(getCourses);
module.exports = router;
