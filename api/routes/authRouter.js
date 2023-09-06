const {
    signup,
    login,
    forgotPassword,
    resetPassword,
    getbasicProfile,
    updatePassword
} = require('../controllers/authController')

const router = require('express').Router()
const checkAuth = require('../middleware/checkAuth')


router.post('/signup', signup)

router.post('/login', login)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

router.use(checkAuth)
router.get('/get-basic-profile', getbasicProfile)
router.patch('/update-password', updatePassword)

module.exports = router