import express from "express"
import dotenv from "dotenv"
dotenv.config()
import cookieParser from "cookie-parser"
import userRoutes from "./routes/userRoute.js"
import { errorHandler, notFound } from "./middleware/errorMiddleware.js"
import connectDB from "./config/db.js"

const port = process.env.PORT || 5000

connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())

app.use("/api/users", userRoutes)

console.log("Hello")


app.use(notFound)
app.use(errorHandler)

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})