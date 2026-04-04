import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

//basic configurations 
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))

app.use(cookieParser())

//cors configurations 
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "PUT", "PATCH", "PUSH", "DELETE", "OPTIONS"],
  allowedHeaders: [ "Authorization", "Content-Type"]
}))

//import the routes
import healthhCheckRouter from "./routes/healthcheck.route.js"
import authRouter from "./routes/auth.route.js"

app.use("/api/v1/healthcheck", healthhCheckRouter)
app.use("/api/v1/auth", authRouter)

app.get('/', (req, res) => {
  res.send('This is my server Respose to  World!')
})

app.get('/git', (req, res) => {
  res.send('This is my server Respose to  GitHub!')
})


export default app