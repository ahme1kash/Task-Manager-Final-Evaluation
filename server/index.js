const express = require("express")
const connect = require("./config/db")
const cors = require("cors")
const app = express();
const morgan = require("morgan")
require("colors")
const PORT = process.env.PORT || 3010;
const dotenv = require("dotenv");
dotenv.config();

//  Middlewares
const corsOptions = {
    origin: ['https://task-manager-final-evaluation-frontend.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'], // Allow only these methods
    allowedHeaders: [
        "Content-Type",
        "Accept",
        "Origin",
        "X-Requested-With",
        "Content-Length",
        "authorization"
    ],
    credentials: true
};

// Use CORS middleware with specified options
app.use(cors(corsOptions));
app.use(express.json())
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/api/share", require("./routes/shareRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/count", require("./routes/countRoutes"));
app.use("/api/search", require("./routes/filterRangeRoutes"));
app.use("/api/onboard", require("./routes/addToBoardRoutes"));

app.listen(PORT, async () => {
    if (await connect()) {
        console.log("Server Status👇\n".blue.bold);
        console.log(await connect());
        console.log(`Server Up and Running at port ${PORT}`.yellow.bold);
    }
});

app.get("/", (req, res) => {
    return res
        .status(200)
        .send("<h1 style='color:red'> Hello, Welcome to Full stack MERN Application of Task manager Server</h1>");
});
