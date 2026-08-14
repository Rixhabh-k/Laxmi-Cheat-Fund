const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

//routes
const authRouter = require("./routes/auth.route")
const userRouter = require("./routes/user.route")
const adminRouter = require("./routes/admin.routes")

const app = express()

// middlewares 
app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.set("trust proxy", 1);

//auth routes
app.use("/api/auth",authRouter)

//user routes
app.use("/api/user",userRouter)

// admin routes
app.use("/api/admin",adminRouter)

module.exports = app