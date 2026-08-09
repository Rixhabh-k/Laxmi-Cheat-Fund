const express = require("express")
const userController = require("../controllers/user.controller")
const verifyUser = require("../middlewares/auth.middleware")
const checkAccountStatus = require("../middlewares/status.middleware")

const userRouter = express.Router()

userRouter.get("/get-profile",verifyUser,userController.getUserProfileContoller)
userRouter.post("/deposite",verifyUser,checkAccountStatus,userController.depositeAmountController)
userRouter.post("/withdrawal",verifyUser,checkAccountStatus,userController.withdrawalAmountController)

module.exports = userRouter