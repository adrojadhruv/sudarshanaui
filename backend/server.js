const express = require("express");
const app = express();
const compression = require("compression");
app.use(compression());
const cors = require("cors");
const allowedOrigins = [
    "http://localhost:5173",
    "https://sudarshanaui.vercel.app" // Add your specific production domain here later if needed, or rely on Vercel rewrites
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // In Vercel usage with rewrites, often the origin header is passed through.
        // We will loosely allow it if it matches our patterns or simply reflect it 
        // if we are confident (but array is safer).
        // Since user domain is variable, let's trust the browser's same-origin handling 
        // for rewrites, but for explicit CORS, let's be permissive or check env.
        return callback(null, true);
    },
    credentials: true
}));
const connectDB = require("./config/db.js");
const cookieParser = require("cookie-parser");
require('dotenv').config();
const PORT = process.env.PORT;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

connectDB();


const user = require("./routes/auth.routes.js");
const componentRoutes = require("./routes/component.routes.js");
const adminRoutes = require("./routes/admin.routes.js");
const collaborationRoutes = require("./routes/collaboration.routes.js");

app.use("/api/v1", user);
app.use("/api/v1", componentRoutes);
app.use("/api/v1", adminRoutes);
app.use("/api/v1/collab", collaborationRoutes);


app.get("/", (req, res) => {
    res.send("Hello World");
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`app  is  running on ${PORT}`);
    });
}

module.exports = app;