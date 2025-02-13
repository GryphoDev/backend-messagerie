const express = require("express");
const connectDB = require("./config/db.js");
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 3000;

connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/post", require("./routes/post.routes.js"));
app.use("/register", require("./routes/register.routes.js"));
app.use("/login", require("./routes/login.routes.js"));

app.listen(port, () => console.log(`Le serveur à démarré au port ${port}`));
