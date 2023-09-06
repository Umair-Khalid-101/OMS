const {
    getTasksByLid,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    submitToManager,
    submitToClient,
    rejectSubmission,
    submitToAdmin,
    assignDesigner,
    assignPrinter,
    assignDelivery,
    taskPrinted,
    taskDelievered
} = require("../controllers/taskController")

const express = require("express")

const router = express.Router()

router.get("/gettasks", getTasksByLid)
router.get("/gettask/:tid", getTaskById)
router.post("/createtask", createTask)
router.patch("/updatetask/:tid", updateTask)
router.delete("/deletetask/:tid", deleteTask)
router.patch("/submit-to-manager/:tid", submitToManager)
router.patch("/submit-to-client/:tid", submitToClient)
router.patch("/submit-to-admin/:tid", submitToAdmin)
router.patch("/reject-submission", rejectSubmission)
router.patch("/assign-designer/:tid", assignDesigner)
router.patch("/assign-printer/:tid", assignPrinter)
router.patch("/assign-delivery/:tid", assignDelivery)
router.patch("/task-printed/:tid", taskPrinted)
router.patch("/task-delivered/:tid", taskDelievered)


module.exports = router

