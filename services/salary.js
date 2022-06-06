const SalaryModel = require('../models/salary')

class SalaryService {

  static QUERY_LIMIT_SIZE = 10;

  static async findById(id) {
    return SalaryModel.findById(id).populate('employee grade')
  }

  static async findBySerialNumber(serial_number) {
    return SalaryModel.findOne({serial_number}).populate('employee grade')
  }

  static async searchBy(search = '', { offset = 0, limit = this.QUERY_LIMIT_SIZE}) {
    let pattern = new RegExp(search, 'ig')
    let docs = await SalaryModel.find({ $or: [{customer_name: pattern}, {customer_email: search}]}).skip(offset).limit(limit).populate('employee grade')
    
    return docs
  }
  
  static async findAll({ offset = 0, limit = this.QUERY_LIMIT_SIZE}) {
    return SalaryModel.find().skip(offset).limit(limit).populate('employee grade')
  }

  static async countMatchingDocuments(search = '') {
    let numberOfDocs
    let pattern = new RegExp(search, 'ig')
    if (search) {
      numberOfDocs = await SalaryModel.count({ $or: [{customer_name: pattern}, {customer_email: search}]})
    } else {
      numberOfDocs = await SalaryModel.count()
    }
    return numberOfDocs
  }

  static async create(dao) {
    return SalaryModel.create(dao)
  }

  static async updateOne(update) {
    return SalaryModel.findByIdAndUpdate(update._id, {$set: update})
  }

  static async removeOne(serial_number) {
    return SalaryModel.findOneAndDelete({serial_number})
  }

}

module.exports = SalaryService