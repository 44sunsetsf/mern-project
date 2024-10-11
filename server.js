const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRoute = require("./routes").auth;
const courseRoute = require("./routes").course;
const passport = require("passport");
require("./config/passport")(passport);
const cors = require("cors");
const path = require("path");
const port = process.env.PORT || 8080;

mongoose
  .connect("process.env.MONGODB_CONNECTION")
  .then(() => {
    console.log("Connecting to mongodb...");
  })
  .catch((e) => {
    console.log(e);
  });

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, "client", "build")));

app.use("/api/user", authRoute);
//要被JWT保护
app.use(
  "/api/courses",
  passport.authenticate("jwt", { session: false }),
  courseRoute
);

if (
  process.env.NODE_ENV === "production" ||
  process.env.NODE_ENV === "staging"
) {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}
app.listen(port, () => {
  console.log("后端服务器在聆听8080");
});
