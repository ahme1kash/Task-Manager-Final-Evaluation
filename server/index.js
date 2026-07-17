const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const connect = require("./config/db");
const cors = require("cors");
const app = express();
const morgan = require("morgan");
require("colors");
const PORT = process.env.PORT || 3010;

const allowedOrigins = [
  "http://localhost:5173",
  "https://task-manager-final-evaluation-3.onrender.com",
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    try {
      new URL(origin);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
    } catch (err) {
      return callback(err);
    }

    return callback(new Error(`CORS blocked origin: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Accept",
    "Origin",
    "X-Requested-With",
    "Content-Length",
    "Authorization",
    "authorization",
  ],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/share", require("./routes/shareRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/count", require("./routes/countRoutes"));
app.use("/api/search", require("./routes/filterRangeRoutes"));
app.use("/api/onboard", require("./routes/addToBoardRoutes"));

app.listen(PORT, async () => {
  const connectionMessage = await connect();
  if (connectionMessage) {
    console.log("Server Status👇\n".blue.bold);
    console.log(connectionMessage);
    console.log(`Server Up and Running at port ${PORT}`.yellow.bold);
  }
});

app.get("/", (req, res) => {
  return res
    .status(200)
    .send(
      "<h1 style='color:red'> Hello, Welcome to Full stack MERN Application of Task manager Server</h1>",
    );
});
