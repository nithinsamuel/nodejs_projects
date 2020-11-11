const mongoose = require("mongoose");
const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a course title"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  weeks: {
    type: String,
    required: [true, "Please add a number of weeks"],
  },
  tuition: {
    type: Number,
    required: [true, "Please add a tuition cost"],
  },
  minimumSkill: {
    type: String,
    required: [true, "Please add a minimum skill"],
    // enum means data must only be of the specified value inside array
    enum: ["beginner", "intermediate", "advanced"],
  },
  scholarshipAvailalbe: {
    type: Boolean,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  //add the bootcamp schema as a field, to establish a relationship with the bootcampSchema
  // type: is called ObjectID (i.e- when we create a new document we create an ObjectId)
  //ref:to know which model to reference
  //required is true so every course has a bootcamp
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true,
  },
});
module.exports = mongoose.model("Course", CourseSchema);
