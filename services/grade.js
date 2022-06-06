const GradeModel = require('../models/grade')

class GradeService {

  static QUERY_LIMIT_SIZE = 10;

  static async findById(id) {
    return GradeModel.findById(id)
  }

  static async findBySerialNumber(serial_number) {
    return GradeModel.findOne({serial_number})
  }

  static async searchBy(search = '', { offset = 0, limit = this.QUERY_LIMIT_SIZE}) {
    let pattern = new RegExp(search, 'ig')
    let docs = await GradeModel.find({ $or: [{grade_name: pattern}]}).skip(offset).limit(limit)
    
    return docs
  }
  
  static async findAll({ offset = 0, limit = this.QUERY_LIMIT_SIZE}) {
    return GradeModel.find().skip(offset).limit(limit)
  }

  static async countMatchingDocuments(search = '') {
    let numberOfDocs
    let pattern = new RegExp(search, 'ig')
    if (search) {
      numberOfDocs = await GradeModel.count({ $or: [{grade_name: pattern}]})
    } else {
      numberOfDocs = await GradeModel.count()
    }
    return numberOfDocs
  }

  static async create(dao) {
    return GradeModel.create(dao)
  }

  static async updateOne(update) {
    return GradeModel.findByIdAndUpdate(update._id, {$set: update})
  }

  static async removeOne(serial_number) {
    return GradeModel.findOneAndDelete({serial_number})
  }

}

module.exports = GradeService