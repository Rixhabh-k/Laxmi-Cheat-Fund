const express = require("express")

const adminRouter = express.Router()

const adminController = require("../controllers/admin.controller")
const verifyUser = require("../middlewares/auth.middleware")

adminRouter.post("/create-admin",adminController.adminRegisterController)
adminRouter.post("/login-admin",adminController.adminLoginController)
adminRouter.get("/get-users",verifyUser,adminController.getUsersController)
adminRouter.patch("/update-users/:userId/status",verifyUser,adminController.updateUserStatusController)


module.exports = adminRouter