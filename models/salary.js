const mongoose = require('mongoose')
const DBCounterModel = require("./db_counter")

let SalarySchema = new mongoose.Schema({
  serial_number: {
    type: Number,
    unique: true,
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'employee'
  },
  employee_id: {
    type: Number,
  },
  employee_name: {
    type: String,
  },
  grade: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'grade'
  },
  grade_name: {
    type: String,
  },
  salary_period: {
    type: String,
  },
  bonus: {
    type: Number,
  },
  deduction: {
    type: Number,
  },
  date_of_payment: {
    type: String,
  }
}, {timestamps: {createdAt: true}})

async function getNextSequenceValue(sequenceName) {
  var sequenceDocument = await DBCounterModel.findOneAndUpdate({ key: sequenceName }, { $inc: { sequence_value: 1}})
  return sequenceDocument.sequence_value
}

SalarySchema.pre("save", async function(next){
  if (this.serial_number == undefined) {
    this.serial_number = await getNextSequenceValue("salaries_id")
  }
  next()
})

module.exports = mongoose.model('salary', SalarySchema)
