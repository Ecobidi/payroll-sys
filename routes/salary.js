const router = require('express').Router()

const SalaryController = require('../controllers/salary')

router.get('/', SalaryController.getSalariesPage)

router.get('/new', SalaryController.createSalaryPage)

router.post('/new', SalaryController.createSalary)

router.get('/view/:salary_id', SalaryController.viewSalary)

router.get('/remove/:salary_id', SalaryController.removeSalary)

module.exports = router