const router = require('express').Router()

const EmployeeRouter = require('./employee')
const GradeRouter = require('./grade')
const SalaryRouter = require('./salary')
const UserRouter = require('./user')
const LoginRouter = require('./login')

const getDashboard = (req, res) => {
  res.render('dashboard')
}

router.use('/login', LoginRouter)

router.use((req, res, next) => {
  if (req.session.user) next()
  else res.redirect('/login')
})

router.get('/', getDashboard)

router.get('/dashboard', getDashboard)

router.use('/grades', GradeRouter)

router.use('/salaries', SalaryRouter)

router.use('/employees', EmployeeRouter)

router.use('/users', UserRouter)

router.use('/logout', (req, res) => {
  req.session.user = null
  res.redirect('/login')
})

module.exports = router