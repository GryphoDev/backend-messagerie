const express = require("express");
const connectDB = require("./config/db.js");
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 3000;

connectDB();

const app = express();
app.use((req, res, next) => {
  console.log("Origin:", req.headers.origin);
  next();
});

const allowedOrigins = [
  "http://localhost:5173",
  "https://messagerie-instantanee.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy error"), false);
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/post", require("./routes/post.routes.js"));
app.use("/register", require("./routes/register.routes.js"));
app.use("/login", require("./routes/login.routes.js"));

app.listen(port, () => console.log(`Le serveur à démarré au port ${port}`));
