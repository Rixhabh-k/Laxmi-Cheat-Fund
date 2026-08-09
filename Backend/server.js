require("dotenv").config()
const app = require("./src/app")
const port = 3000

const connectToDb = require("./src/config/databse")

app.listen(port || "port not found",()=>{
    console.log("server is running at port 3000")
    connectToDb()
})