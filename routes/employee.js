const router = require('express').Router()
const multer = require('multer')

const EmployeeController = require('../controllers/employee')
const UserController = require('../controllers/user')

const upload = multer({})

router.get('/', EmployeeController.getEmployeesPage)

router.get('/new', EmployeeController.createEmployeePage)

router.post('/new', upload.single('photo'), EmployeeController.createEmployee)

router.get('/update/:employee_id', EmployeeController.updateEmployeePage)

router.post('/update', upload.single('photo'), EmployeeController.updateEmployee)

router.get('/remove/:employee_id', UserController.hasAdminAuthorization, EmployeeController.removeEmployee)

module.exports = router