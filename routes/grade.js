const router = require('express').Router()

const GradeController = require('../controllers/grade')

router.get('/', GradeController.getGradesPage)

router.get('/new', GradeController.createGradePage)

router.post('/new', GradeController.createGrade)

router.get('/update/:grade_id', GradeController.editGradePage)

router.post('/update', GradeController.editGrade)

router.get('/remove/:grade_id', GradeController.removeGrade)

module.exports = router