const EmployeeService = require('../services/employee')
const GradeModel = require('../models/grade')

class EmployeeController {

  static async getEmployeesPage(req, res) {
    let pageNumber = Number.parseInt(req.query.page ? req.query.page : 1)
    let limit_size = Number.parseInt(req.query.limit || EmployeeService.QUERY_LIMIT_SIZE)
    let offset = pageNumber * limit_size - limit_size
    let search = req.query.search
    let employees, totalDocuments
    if (search) {
      employees = await EmployeeService.searchBy(search, {limit: limit_size, offset}) 
      totalDocuments = await EmployeeService.countMatchingDocuments(search)
    } else {
      employees = await EmployeeService.findAll({limit: limit_size, offset})
      totalDocuments = await EmployeeService.countMatchingDocuments()
    }
    let totalNumberOfPages = Math.ceil(await totalDocuments / limit_size)

    res.render('employees', {employees, currentPage: pageNumber, totalNumberOfPages, totalDocuments, limit_size, offset, searchTerm: search })
  }

  static async createEmployeePage(req, res) {
    let grades = await GradeModel.find()
    res.render('employee-new', { grades })
  }

  static async createEmployee(req, res) {
    let dao = req.body
    try {
      if (req.file) {
        let editedImage = await sharp(req.file.buffer).resize(620, 580).toBuffer()
        const imageInfo = await streamUpload(editedImage, process.env.PROJECT_CLOUDINARY_IMAGE_FOLDER + "/employees")
        dao.photo = imageInfo.url
        dao.photo_public_id = imageInfo.public_id
      }
      await EmployeeService.create(dao)
      req.flash('success_msg', "Employee Added")
      res.redirect('/employees')
    } catch (err) {
      console.log(err)
      res.redirect('/employees')
    }
  }

  static async updateEmployeePage(req ,res) {
    let employee = await EmployeeService.findBySerialNumber(req.params.employee_id)
    let grades = await GradeModel.find()
    res.render('employee-update', { employee, grades })
  }

  static async updateEmployee(req, res) {
    let dao = req.body
    try {
      let employee = await EmployeeService.findById(dao._id)
      if (!employee) {
        req.flash('error_msg', 'Invalid Update Operation')
        return res.redirect('/employees')
      }
      if (req.file) {
        // remove prev image
        employee.photo_public_id && await removeUploadedFile(employee.photo_public_id)
        let editedImage = await sharp(req.file.buffer).resize(620, 580).toBuffer()
        const imageInfo = await streamUpload(editedImage, process.env.PROJECT_CLOUDINARY_IMAGE_FOLDER + "/employees")
        dao.photo = imageInfo.url
        dao.photo_public_id = imageInfo.public_id
      }
      await EmployeeService.updateOne(dao)
      req.flash('success_msg', "Employee record updated")
      res.redirect('/employees')
    } catch (err) {
      console.log(err)
      req.flash('error_msg', 'Error processing update')
      res.redirect('/employees')
    }
  }

  static async markAsInactive(req, res) {
    try {
      let employee = await EmployeeService.findById(req.body._id)
      if (!employee) {
        req.flash('error_msg', 'Invalid update operation')
        return res.redirect('/employees')
      }
      await EmployeeService.updateOne({...employee, is_active: false})
      req.flash('success_msg', 'Employee record updated')
      res.redirect('/employees/view/' + employee.serial_number)
    } catch (error) {
      console.log(error)
      req.flash('error_msg', 'Error updating employee')
      res.redirect('/employees')
    }
  }

  static async removeEmployee(req, res) {
    try {
      await EmployeeService.removeOne(req.params.employee_id)
      req.flash('success_msg', 'Employee removed')
      res.redirect('/employees')
    } catch (err) {
      console.log(err)
      req.flash('error_msg', 'Error removing record')
      res.redirect('/employees')
    }
  }

}

module.exports = EmployeeController