const mongoose = require('mongoose')
const DBCounterModel = require("./db_counter")

let GradeSchema = new mongoose.Schema({
  serial_number: {
    type: Number,
    unique: true,
  },
  grade_name: {
    type: String,
  },
  basic_salary: {
    type: Number,
    required: true,
  },
  transport_allowance: {
    type: Number,
  },
  housing_allowance: {
    type: Number,
  },
  medical_allowance: {
    type: Number,
  },
  other_allowance: {
    type: Number,
  },
  tax: {
    type: Number,
  }
}, {timestamps: {createdAt: true}})

async function getNextSequenceValue(sequenceName) {
  var sequenceDocument = await DBCounterModel.findOneAndUpdate({ key: sequenceName }, { $inc: { sequence_value: 1}})
  return sequenceDocument.sequence_value
}

GradeSchema.pre("save", async function(next){
  if (this.serial_number == undefined) {
    this.serial_number = await getNextSequenceValue("grades_id")
  }
  next()
})

module.exports = mongoose.model('grade', GradeSchema)
