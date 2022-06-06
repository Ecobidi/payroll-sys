const GradeService = require('../services/grade')

class GradeController {

  static async getGradesPage(req, res) {
    let pageNumber = Number.parseInt(req.query.page ? req.query.page : 1)
    let limit_size = Number.parseInt(req.query.limit || GradeService.QUERY_LIMIT_SIZE)
    let offset = pageNumber * limit_size - limit_size
    let search = req.query.search
    let grades, totalDocuments
    
    if (search) {
      grades = await GradeService.searchBy(search, {limit: limit_size, offset}) 
      totalDocuments = await GradeService.countMatchingDocuments(search)
    } else {
      grades = await GradeService.findAll({limit: limit_size, offset})
      totalDocuments = await GradeService.countMatchingDocuments()
    }
    let totalNumberOfPages = Math.ceil(await totalDocuments / limit_size)

    res.render('grades', { grades, currentPage: pageNumber, totalNumberOfPages, totalDocuments, limit_size, offset, searchTerm: search })
  }

  static async createGradePage(req, res) {
    res.render('grade-new')
  }

  static async createGrade(req, res) {
    let dao = req.body
    try {
      await GradeService.create(dao)
      req.flash('success_msg', "Grade inserted")
      res.redirect('/grades')
    } catch (err) {
      console.log(err)
      res.redirect('/grades')
    }
  }

  static async editGradePage(req, res) {
    let serial_number = req.params.grade_id
    let grade = await GradeService.findBySerialNumber(serial_number)
    res.render('grade-edit', { grade })
  }

  static async editGrade(req, res) {
    let dao = req.body
    try {
      await GradeService.updateOne(dao)
      req.flash('success_msg', "Grade updated")
      res.redirect('/grades')
    } catch (err) {
      console.log(err)
      req.flash('error_msg', 'Error processing update')
      res.redirect('/grades')
    }
  }

  static async removeGrade(req, res) {
    try {
      await GradeService.removeOne(req.params.grade_id)
      req.flash('success_msg', 'Record removed')
      res.redirect('/grades')
    } catch (err) {
      console.log(err)
      req.flash('error_msg', 'Error removing record')
      res.redirect('/grades')
    }
  }

}

module.exports = GradeController