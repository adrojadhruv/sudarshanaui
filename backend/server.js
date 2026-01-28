const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors({
    origin: "http://localhost:5173",
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