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
  origin: process.env.CORS_ORIGIN?.split(",") ||"http://127.0.0.1:5500" || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "PUT", "PATCH", "PUSH", "DELETE", "OPTIONS"],
  allowedHeaders: [ "Authorization", "Content-Type"]
}))

//import the routes
import healthhCheckRouter from "./routes/healthcheck.route.js"
import authRouter from "./routes/auth.route.js"
import projectRouter from "./routes/project.route.js"
import taskRouter from "./routes/task.routes.js"
import noteRouter from "./routes/note.route.js"

app.use("/api/v1/healthcheck", healthhCheckRouter)
app.use("/api/v1/projects", projectRouter)
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/tasks", taskRouter)
app.use("/api/v1/notes", noteRouter)

app.get('/', (req, res) => {
  res.send('This is my server Respose to  World!')
})

app.get('/git', (req, res) => {
  res.send('This is my server Respose to  GitHub!')
})


export default app