const {
    getOrders,
    getOrder,
    createOrder,
    sendReminder,
    updateOrder,
    deleteOrder,
    getShippingRates
} = require('../controllers/orderController')

const router = require('express').Router()

router.get('/', getOrders)
router.get('/:id', getOrder)
router.post('/', createOrder)
router.post('/shippingrate', getShippingRates)
router.post('/send-reminder/:id', sendReminder)
router.patch('/:id', updateOrder)
router.delete('/:id', deleteOrder)

module.exports = router