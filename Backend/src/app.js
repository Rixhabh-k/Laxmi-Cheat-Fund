const express = require("express")
const cookieParser = require("cookie-parser")

//routes
const authRouter = require("./routes/auth.route")
const userRouter = require("./routes/user.route")
const adminRouter = require("./routes/admin.routes")

const app = express()

// middlewares 
app.use(express.json())
app.use(cookieParser())

//auth routes
app.use("/api/auth",authRouter)

//user routes
app.use("/api/user",userRouter)

// admin routes
app.use("/api/admin",adminRouter)

module.exports = app