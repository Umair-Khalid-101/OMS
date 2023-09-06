const { getNotification } = require("../controllers/notificationController");

const router = require("express").Router();

router.get("/:uid", getNotification);

module.exports = router;
