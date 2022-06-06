const mongoose = require('mongoose')
const DBCounterModel = require("./db_counter")

let EmployeeSchema = new mongoose.Schema({
  serial_number: {
    type: Number,
    unique: true,
  },
  surname: {
    type: String,
    required: true,
  },
  other_names: {
    type: String,
    required: true,
  },
  grade: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'grade'
  },
  position: {
    type: String,
  },
  address: {
    type: String,
  },
  qualification: {
    type: String,
  },
  phone: {
    type: String,
  },
  account_name: {
    type: String,
  },
  account_number: {
    type: String,
  },
  bank_name: {
    type: String,
  },
  date_joined: {
    type: String,
  },
  status: {
    type: String,
    default: 'Active'
  },
  photo: {
    type: String,
  },
  photo_public_id: {
    type: String,
  }
}, {timestamps: {createdAt: true}})

async function getNextSequenceValue(sequenceName) {
  var sequenceDocument = await DBCounterModel.findOneAndUpdate({ key: sequenceName }, { $inc: { sequence_value: 1}})
  return sequenceDocument.sequence_value
}

EmployeeSchema.pre("save", async function(next){
  if (this.serial_number == undefined) {
    this.serial_number = await getNextSequenceValue("employees_id")
  }
  next()
})

module.exports = mongoose.model('employee', EmployeeSchema)
