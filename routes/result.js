const express = require('express');
const router = express.Router();
const Result = require('../models/Result');
const Student = require('../models/Student');
const auth = require('../middlewares/auth');

//@result GET
router.get('/:sem/:roll', auth, async (req, res) => {
  const {roll, sem} = req.params;
  // get current logged in user
  const student = await Student.findOne({roll: roll});

  if (!student) return res.status(500).json({msg: 'Student not found.'});
  // logged in student == requesting roll no student
  else if (student._id == req.user.id) {
    // find the result of the student
    Result.find({studentRoll: roll})
      .then(results => {
        // console.log(results)
        if (results.length < 1) return res.json({msg: 'Result not found'});
        results.map(result => (result.semester === sem ? res.json(result) : false));
      })
      .catch(err => res.json({msg: err.message}));
  } else {
    res.status(500).json({msg: 'You are not currently authorized for this request'});
  }
});

//@ result POST
//@ adding result for a student
router.post('/:sem/:roll', (req, res) => {
  const {subjects, cgpa, sgpa} = req.body;
  const roll = req.params.roll;
  const semester = req.params.sem;

  if (!subjects || !cgpa || !sgpa || !roll || !semester)
    return res.status(400).json({msg: 'please fill up all the result fields'});

  const newResult = new Result({
    studentRoll: roll,
    semester,
    subjects,
    cgpa,
    sgpa,
  });

  newResult
    .save()
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(400).json({msg: 'unable to save result'});
    });
});

module.exports = router;