const EmployeeModel = require('../models/employee')

class EmployeeService {

  static QUERY_LIMIT_SIZE = 10;

  static async findById(id) {
    return EmployeeModel.findById(id).populate('grade')
  }

  static async findBySerialNumber(serial_number) {
    return EmployeeModel.findOne({serial_number}).populate('grade')
  }

  static async searchBy(search = '', { offset = 0, limit = this.QUERY_LIMIT_SIZE}) {
    let pattern = new RegExp(search, 'ig')
    let docs = await EmployeeModel.find({ $or: [{other_names: pattern}, {surname: pattern}]}).skip(offset).limit(limit).sort('-_id').populate('grade')
    
    return docs
  }
  
  static async findAll({ offset = 0, limit = this.QUERY_LIMIT_SIZE}) {
    return EmployeeModel.find().skip(offset).limit(limit).sort('-_id').populate('grade')
  }

  static async countMatchingDocuments(search = '') {
    let numberOfDocs
    let pattern = new RegExp(search, 'ig')
    if (search) {
      numberOfDocs = await EmployeeModel.count({ $or: [{other_names: pattern}, {surname: pattern}]})
    } else {
      numberOfDocs = await EmployeeModel.count()
    }
    return numberOfDocs
  }

  static async create(dao) {
    return EmployeeModel.create(dao)
  }

  static async updateOne(update) {
    return EmployeeModel.findByIdAndUpdate(update._id, {$set: update})
  }

  static async removeOne(serial_number) {
    return EmployeeModel.findOneAndDelete({serial_number})
  }

}

module.exports = EmployeeService