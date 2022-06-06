const SalaryService = require('../services/salary')
const EmployeeModel = require('../models/employee')

class GradeController {

  static async getSalariesPage(req, res) {
    let pageNumber = Number.parseInt(req.query.page ? req.query.page : 1)
    let limit_size = Number.parseInt(req.query.limit || SalaryService.QUERY_LIMIT_SIZE)
    let offset = pageNumber * limit_size - limit_size
    let search = req.query.search
    let salaries, totalDocuments
    
    if (search) {
      salaries = await SalaryService.searchBy(search, {limit: limit_size, offset}) 
      totalDocuments = await SalaryService.countMatchingDocuments(search)
    } else {
      salaries = await SalaryService.findAll({limit: limit_size, offset})
      totalDocuments = await SalaryService.countMatchingDocuments()
    }
    let totalNumberOfPages = Math.ceil(await totalDocuments / limit_size)

    res.render('salaries', { salaries, currentPage: pageNumber, totalNumberOfPages, totalDocuments, limit_size, offset, searchTerm: search })
  }

  static async createSalaryPage(req, res) {
    let employee
    let employees = await EmployeeModel.find()
    if (req.query.employee_id) {
      employee = await EmployeeModel.findById(req.query.employee_id).populate('grade')
    }
    res.render('salary-new', { employee, employees })
  }

  static async createSalary(req, res) {
    let dao = req.body
    try { 
      await SalaryService.create(dao)
      req.flash('success_msg', "Salary record inserted")
      res.redirect('/salaries')
    } catch (err) {
      console.log(err)
      res.redirect('/salaries')
    }
  }

  static async viewSalary(req, res) {
    try {
      let salary = await SalaryService.findBySerialNumber(req.params.salary_id)
      if (!salary) {
        req.flash('error_msg', 'Error retrieving salary info')
        return res.redirect('/salaries')
      }
      res.render('salary-slip', { salary })
    } catch (error) {
      console.log(error)
      req.flash('error_msg', 'Error retrieving salary info')
      res.redirect('/salaries')
    }
  }

  static async removeSalary(req, res) {
    try {
      await SalaryService.removeOne(req.params.salary_id)
      req.flash('success_msg', 'Record removed')
      res.redirect('/salaries')
    } catch (err) {
      console.log(err)
      req.flash('error_msg', 'Error removing record')
      res.redirect('/salaries')
    }
  }

}

module.exports = GradeController