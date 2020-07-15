require("custom-env").env(true);
require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const db = mongoose.connection;
const dbConfig = { useNewUrlParser: true, useUnifiedTopology: true };
const { PORT, SECRET } = process.env;
// const PORT = process.env.PORT;
// const SECRET = process.env;
const Person = require("./models/persons.js");

/******
 * Auth Function
 **/
const auth = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    // "bearer p9283n9283n923rc23u9u"
    if (authorization) {
      const token = authorization.split(" ")[1];
      const result = jwt.verify(token, SECRET);
      req.user = result;
      console.log(req.user);
      next();
    } else {
      res.send("NO TOKEN");
    }
  } catch (error) {
    res.send(error);
  }
};

/******
 * Cors
 **/
const corsOptions = {
  origin: process.env.cor,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs choke on 204)
};

/******
 * Middleware
 **/
app.use(cors(corsOptions));
app.use(express.json());

/******
 * Connect to database
 **/
mongoose.connect(process.env.MONGODB_URI, dbConfig);
db.on("open", () => {
  console.log("Connected to DB");
});
db.on("error", (err) => {
  console.log(err);
});

/******
 * Dummy user
 **/
const user = { username: "user", password: "pass" };


/******
 * Test route
 **/
app.get("/test", auth, (req, res) => {
  res.send("Success.");
});

/******
 * Auth Route
 **/
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === user.username && password === user.password) {
    const token = jwt.sign({ username }, SECRET);
    res.json(token);
  } else {
    res.send("WRONG USERNAME OR PASSWORD");
  }
});

/******
 * Routes
 **/
app.get("/index", async (req, res) => {
  res.json(await Person.find({}));
});

app.post("/create", async (req, res) => {
  res.json(await Person.create(req.body));
});

app.get("/show/:id", async (req, res) => {
  res.json(await Person.findById(req.params.id));
});

app.put("/update/:id", async (req, res) => {
  res.json(await Person.findByIdAndUpdate(req.params.id, req.body));
});

app.delete("/delete/:id", async (req, res) => {
  res.json(await Person.findByIdAndDelete(req.params.id));
});

/******
 * Server listener
 **/
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
