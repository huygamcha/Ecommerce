var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");

var app = express();
app.use(
  cors({
    origin: "*",
  })
);

console.log(`${process.env.CONNECTION_STRING}${process.env.DB_NAME}`);
mongoose.connect(`${process.env.CONNECTION_STRING}${process.env.DB_NAME}`);

var categoryRouter = require("./routes/Category/router.js");
var supplierRouter = require("./routes/Supplier/router.js");
var employeeRouter = require("./routes/Employee/router.js");
var customerRouter = require("./routes/Customer/router.js");
var productRouter = require("./routes/Product/router.js");
var orderRouter = require("./routes/Order/router.js");
var authRouter = require("./routes/auth/router.js");
const { admin } = require("./authentication/checkRole.js");
// var usersRouter = require("./routes/users");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/categories", categoryRouter);
app.use("/suppliers", supplierRouter);
app.use("/employees", employeeRouter);
app.use("/customers", customerRouter);
app.use("/products", productRouter);
app.use("/orders", orderRouter);
app.use("/", authRouter);
// app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
