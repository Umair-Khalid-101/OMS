const { getAllUsers,
    getUserById,
    inviteUser,
    inviteDesigner,
    acceptInvitation,
    removeInvitation,
    updateStatus,
    getDesigner,
    getManager,
    getDesignerByAM,
    getManagerCond
} = require('../controllers/userController')

const router = require('express').Router()
const checkAuth = require('../middleware/checkAuth')
const { restrictTo } = require('../middleware/restrictRoute')


router.post('/accept-editor', acceptInvitation)

router.use(checkAuth)

router.use(restrictTo('admin', 'manager', 'designer', 'printing', 'shipping'))

router.get('/designer-by-am', getDesignerByAM)
router.get('/manager-cond', getManagerCond)

router.patch('/update-status', updateStatus)
router.get('/users', getAllUsers)
router.get('/get-designer', getDesigner)
router.get('/get-manager', getManager)

router.get('/user/:id', getUserById)
router.post('/invite-manager', inviteUser)
router.post('/invite-designer', inviteDesigner)
router.delete('/remove-invitation/:id', removeInvitation)

module.exports = router