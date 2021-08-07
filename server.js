const express = require("express");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3030;
const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Users = require("./db/User");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello there");
});

app.post("/post", (req, res) => {
  res.json({
    message: "Post created",
  });
});

//authenticate user
app.post("/signup", async (req, res) => {
  //console.log(req.query);
  res.json({
    message: "Request received",
    data: req.query,
  });
  // const userID = req.body.uid;
  // const pwd = req.body.password;
  // //hash password
  // const hash = bcrypt.hash(pwd, 12, (e) => console.log(e));
  // //check if user exists
  // const checkUser = await Users.findOne({ uid: userID });
  // if (checkUser) {
  //   res.send("User exists");
  // } else {
  //   const newUser = new Users({
  //     uid: userID,
  //     password: hash,
  //   });
  //   //generate token
  //   const token = jwt.sign({ user: userID }, "shhhhhh", (err, res) => {
  //     if (err) res.json({ message: "error with jwt" });
  //   });
  //   const result = await newUser.save();
  //   res.json({ token: token, result: result });
  // }
});

//sign in user
app.post("/signin", async (req, res) => {
  const userID = req.body.uid;
  const pwd = req.body.password;
  //hash password
  //const hash = bcrypt.hash(pwd, 12, (e) => console.log(e));
  //check if user exists
  const checkUser = Users.findOne({ uid: userID });

  const token = jwt.sign({ user: userID }, "signin");
  if (checkUser) {
    res.send(token);
  } else {
    res.send("No account with those details found");
  }
});

mongoose
  .connect(
    "mongodb+srv://Quamies:qgP92ODhqcrYBY71@cluster0.si7kr.mongodb.net/shaap_users?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then((res) => {
    console.log("Database running");
  })
  .catch((e) => console.log("Database error " + e));

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
