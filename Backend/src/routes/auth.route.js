const express = require("express")
const authController = require("../controllers/auth.controller")
const multer  = require('multer')
const upload = multer({storage:multer.memoryStorage()})

//middlewares
const checkAccountStatus = require("../middlewares/status.middleware")

const authRouter = express.Router()

authRouter.post("/create-account",upload.single("image"),authController.createAccountControlller);
authRouter.post("/login",checkAccountStatus,authController.loginController)

module.exports = authRouter